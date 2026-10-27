package com.app.studygroup.servlet;

import com.app.studygroup.dto.AuthResponse;
import com.app.studygroup.dto.RegisterRequest;
import com.app.studygroup.exception.InvalidInputException;
import com.app.studygroup.exception.UserAlreadyExistsException;
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
 * RegisterServlet handles user registration via GET and POST requests.
 * Demonstrates:
 * - Phase 4: Process registration using Servlets (GET/POST)
 * - Server-side validation, duplicate username/email checks
 * - Password hashing and secure persistent storage
 * - Session creation and redirection to dashboard upon successful registration
 */
@WebServlet(name = "RegisterServlet", urlPatterns = {"/register", "/servlet/register"})
public class RegisterServlet extends HttpServlet {

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
        if (isJsonRequest(request)) {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write("{\"success\":true,\"message\":\"RegisterServlet is active. Submit POST request to register.\"}");
        } else {
            response.sendRedirect(request.getContextPath() + "/register.jsp");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String name = request.getParameter("name");
        String username = request.getParameter("username");
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String confirmPassword = request.getParameter("confirmPassword");
        String university = request.getParameter("university");
        String role = request.getParameter("role");

        // Validate password confirmation match
        if (password != null && confirmPassword != null && !password.equals(confirmPassword)) {
            handleFailure(request, response, "Passwords do not match.", HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        RegisterRequest registerRequest = RegisterRequest.builder()
                .name(name != null ? name.trim() : null)
                .username(username != null ? username.trim() : null)
                .email(email != null ? email.trim() : null)
                .password(password)
                .university(university != null ? university.trim() : null)
                .role(role != null && !role.isBlank() ? role.trim() : "student")
                .build();

        try {
            AuthResponse authResponse = userOperations.register(registerRequest);
            if (authResponse.isSuccess() && authResponse.getUser() != null) {
                // Create session after successful registration
                HttpSession session = request.getSession(true);
                try {
                    request.changeSessionId();
                } catch (Exception ignored) {
                }
                userOperations.storeUserInSession(session, authResponse.getUser());

                var u = authResponse.getUser();
                if (isJsonRequest(request)) {
                    response.setStatus(HttpServletResponse.SC_CREATED);
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
                    // Redirect to dashboard with registration confirmation flag
                    response.sendRedirect(request.getContextPath() + "/dashboard.jsp?registered=true");
                }
            } else {
                handleFailure(request, response, authResponse.getMessage(), HttpServletResponse.SC_BAD_REQUEST);
            }
        } catch (InvalidInputException | UserAlreadyExistsException ex) {
            handleFailure(request, response, ex.getMessage(), HttpServletResponse.SC_BAD_REQUEST);
        } catch (Exception ex) {
            handleFailure(request, response, "An unexpected error occurred during registration: " + ex.getMessage(), HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
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
            request.setAttribute("errorMessage", errorMessage);
            request.setAttribute("name", request.getParameter("name"));
            request.setAttribute("username", request.getParameter("username"));
            request.setAttribute("email", request.getParameter("email"));
            request.setAttribute("university", request.getParameter("university"));
            request.setAttribute("role", request.getParameter("role"));
            request.getRequestDispatcher("/register.jsp").forward(request, response);
        }
    }
}
