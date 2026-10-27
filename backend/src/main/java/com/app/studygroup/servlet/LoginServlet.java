package com.app.studygroup.servlet;

import com.app.studygroup.dto.AuthResponse;
import com.app.studygroup.dto.LoginRequest;
import com.app.studygroup.exception.AuthenticationException;
import com.app.studygroup.exception.InvalidInputException;
import com.app.studygroup.service.UserOperations;
import jakarta.servlet.ServletConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import java.io.IOException;

/**
 * LoginServlet handles user authentication via GET and POST requests.
 * Demonstrates:
 * - Phase 4: Process registration and login using Servlets (GET/POST)
 * - Server-side credential validation against BCrypt password hash
 * - Session tracking using HttpSession and session rotation
 * - Redirects to JSP dashboard on success or forwards to login.jsp with error
 */
@WebServlet(name = "LoginServlet", urlPatterns = {"/login", "/servlet/login"})
public class LoginServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private UserOperations userOperations;

    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        WebApplicationContext context = WebApplicationContextUtils
                .getRequiredWebApplicationContext(config.getServletContext());
        this.userOperations = context.getBean(UserOperations.class);
    }

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
        // If user already logged in, redirect directly to dashboard
        HttpSession session = request.getSession(false);
        if (session != null && (session.getAttribute("userId") != null || session.getAttribute("currentUser") != null)) {
            response.sendRedirect(request.getContextPath() + "/dashboard.jsp");
            return;
        }

        if (isJsonRequest(request)) {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write("{\"success\":true,\"message\":\"LoginServlet is active. Submit POST request with credentials.\"}");
        } else {
            response.sendRedirect(request.getContextPath() + "/login.jsp");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Read form fields: username and password (per Section 2 & 4 of Student Notes)
        String username = request.getParameter("username");
        if (username == null || username.isBlank()) {
            username = request.getParameter("identifier");
        }
        if (username == null || username.isBlank()) {
            username = request.getParameter("email");
        }
        String password = request.getParameter("password");
        String role = request.getParameter("role");

        // Server-side validation of required fields
        if (username == null || username.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            handleFailure(request, response, "Username and password are required.", HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        LoginRequest loginRequest = LoginRequest.builder()
                .username(username.trim())
                .email(username.trim())
                .password(password)
                .role(role)
                .build();

        try {
            AuthResponse authResponse = userOperations.login(loginRequest);
            if (authResponse.isSuccess() && authResponse.getUser() != null) {
                // Section 5: Create or access session and rotate session ID to reduce session-fixation risk
                HttpSession session = request.getSession(true);
                try {
                    request.changeSessionId();
                } catch (Exception ignored) {
                }
                userOperations.storeUserInSession(session, authResponse.getUser());

                var u = authResponse.getUser();
                if (isJsonRequest(request)) {
                    response.setStatus(HttpServletResponse.SC_OK);
                    response.setContentType("application/json");
                    response.setCharacterEncoding("UTF-8");
                    response.getWriter().write(String.format(
                            "{\"success\":true,\"message\":\"%s\",\"sessionId\":\"%s\",\"user\":{\"id\":\"%s\",\"name\":\"%s\",\"username\":\"%s\",\"email\":\"%s\",\"university\":\"%s\",\"avatar\":\"%s\",\"role\":\"%s\"}}",
                            escapeJson(authResponse.getMessage()),
                            session.getId(),
                            escapeJson(u.getId()),
                            escapeJson(u.getName()),
                            escapeJson(u.getUsername()),
                            escapeJson(u.getEmail()),
                            escapeJson(u.getUniversity()),
                            escapeJson(u.getAvatar()),
                            escapeJson(u.getRole())
                    ));
                } else {
                    // Section 4: Redirect to the dashboard using request.getContextPath()
                    response.sendRedirect(request.getContextPath() + "/dashboard.jsp");
                }
            } else {
                handleFailure(request, response, "Invalid credentials. Access denied.", HttpServletResponse.SC_UNAUTHORIZED);
            }
        } catch (AuthenticationException | InvalidInputException ex) {
            handleFailure(request, response, ex.getMessage(), HttpServletResponse.SC_UNAUTHORIZED);
        } catch (Exception ex) {
            handleFailure(request, response, "An unexpected error occurred: " + ex.getMessage(), HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    private void handleFailure(HttpServletRequest request, HttpServletResponse response, String errorMessage, int statusCode)
            throws ServletException, IOException {
        if (isJsonRequest(request)) {
            response.setStatus(statusCode);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(String.format(
                    "{\"success\":false,\"message\":\"%s\",\"user\":null}",
                    escapeJson(errorMessage)
            ));
        } else {
            // Forward to login.jsp with error message to preserve state
            request.setAttribute("errorMessage", errorMessage);
            String userParam = request.getParameter("username");
            if (userParam == null) userParam = request.getParameter("identifier");
            request.setAttribute("username", userParam != null ? userParam : "");
            request.getRequestDispatcher("/login.jsp").forward(request, response);
        }
    }
}
