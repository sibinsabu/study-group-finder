package com.app.studygroup.servlet;

import com.app.studygroup.dto.UserDto;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

/**
 * DashboardServlet serves the secure user dashboard.
 * Demonstrates:
 * - Phase 4: Restrict dashboard access without login (session guard)
 * - Session tracking attributes extraction and verification (userId, username, currentUser)
 * - Cache prevention headers for post-logout security
 */
@WebServlet(name = "DashboardServlet", urlPatterns = {"/dashboard", "/servlet/dashboard"})
public class DashboardServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    private boolean isJsonRequest(HttpServletRequest request) {
        String accept = request.getHeader("Accept");
        String contentType = request.getContentType();
        String xRequestedWith = request.getHeader("X-Requested-With");
        return (accept != null && accept.contains("application/json"))
                || (contentType != null && contentType.contains("application/json"))
                || "XMLHttpRequest".equalsIgnoreCase(xRequestedWith);
    }

    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r");
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Phase 4 & Section 7: Restrict dashboard access without login
        HttpSession session = request.getSession(false);

        if (session == null || (session.getAttribute("userId") == null && session.getAttribute("currentUser") == null)) {
            if (isJsonRequest(request)) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                response.getWriter().write("{\"success\":false,\"message\":\"Access Denied: Please log in to access the dashboard.\"}");
            } else {
                response.sendRedirect(request.getContextPath() + "/login.jsp?error=unauthorized");
            }
            return;
        }

        // Section 8: Cache-Control headers to protect sensitive pages from browser Back button
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setDateHeader("Expires", 0);

        if (isJsonRequest(request)) {
            UserDto currentUser = (UserDto) session.getAttribute("currentUser");
            String username = (String) session.getAttribute("username");
            String userId = (String) session.getAttribute("userId");
            String email = currentUser != null ? currentUser.getEmail() : (String) session.getAttribute("userEmail");
            String role = currentUser != null ? currentUser.getRole() : (String) session.getAttribute("role");
            String name = currentUser != null ? currentUser.getName() : username;

            response.setStatus(HttpServletResponse.SC_OK);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(String.format(
                    "{\"success\":true,\"message\":\"Dashboard access granted\",\"sessionId\":\"%s\",\"user\":{\"id\":\"%s\",\"name\":\"%s\",\"username\":\"%s\",\"email\":\"%s\",\"role\":\"%s\"}}",
                    session.getId(),
                    escapeJson(userId),
                    escapeJson(name),
                    escapeJson(username),
                    escapeJson(email),
                    escapeJson(role)
            ));
        } else {
            // Forward to dynamic JSP dashboard
            request.getRequestDispatcher("/dashboard.jsp").forward(request, response);
        }
    }
}
