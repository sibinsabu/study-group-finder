package com.app.studygroup.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

/**
 * LogoutServlet invalidates active HttpSession and terminates the user session.
 * Demonstrates:
 * - Phase 4: Implement logout and session invalidation
 * - Uses POST for logout form to prevent accidental logout via prefetch
 * - Redirects to login.jsp after session invalidation
 * - Sets cache-control headers to prevent back-button viewing of sensitive pages
 */
@WebServlet(name = "LogoutServlet", urlPatterns = {"/logout", "/servlet/logout"})
public class LogoutServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    private boolean isJsonRequest(HttpServletRequest request) {
        String accept = request.getHeader("Accept");
        String contentType = request.getContentType();
        String xRequestedWith = request.getHeader("X-Requested-With");
        return (accept != null && accept.contains("application/json"))
                || (contentType != null && contentType.contains("application/json"))
                || "XMLHttpRequest".equalsIgnoreCase(xRequestedWith);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processLogout(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processLogout(request, response);
    }

    private void processLogout(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        // Section 8: Invalidate current session
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.removeAttribute("currentUser");
            session.removeAttribute("userId");
            session.removeAttribute("username");
            session.removeAttribute("userEmail");
            session.removeAttribute("name");
            session.removeAttribute("role");
            session.removeAttribute("loginTime");
            session.invalidate();
        }

        // Section 8: Prevent browser caching of sensitive pages after logout
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setDateHeader("Expires", 0);

        if (isJsonRequest(request)) {
            response.setStatus(HttpServletResponse.SC_OK);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write("{\"success\":true,\"message\":\"Session successfully invalidated and logged out.\"}");
        } else {
            response.sendRedirect(request.getContextPath() + "/login.jsp?loggedOut=true");
        }
    }
}
