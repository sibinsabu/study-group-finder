package com.app.studygroup.servlet;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

/**
 * AuthenticationFilter protects secured resources such as dashboard.jsp.
 * Demonstrates:
 * - Section 6 & 7: "For a larger application, use a Servlet Filter mapped to protected URL patterns"
 * - Server-side authentication check before reaching protected resources
 * - Enforces no-cache headers to secure browser history navigation
 */
@WebFilter(filterName = "AuthenticationFilter", urlPatterns = {"/dashboard.jsp"})
public class AuthenticationFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // Check authentication
        HttpSession session = httpRequest.getSession(false);
        boolean isAuthenticated = session != null 
                && (session.getAttribute("userId") != null || session.getAttribute("currentUser") != null);

        if (!isAuthenticated) {
            String accept = httpRequest.getHeader("Accept");
            if (accept != null && accept.contains("application/json")) {
                httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                httpResponse.setContentType("application/json");
                httpResponse.setCharacterEncoding("UTF-8");
                httpResponse.getWriter().write("{\"success\":false,\"message\":\"Access Denied: Please log in first.\"}");
            } else {
                httpResponse.sendRedirect(httpRequest.getContextPath() + "/login.jsp?error=unauthorized");
            }
            return;
        }

        // Section 8: Cache-control headers to prevent browser caching of protected content
        httpResponse.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        httpResponse.setHeader("Pragma", "no-cache");
        httpResponse.setDateHeader("Expires", 0);

        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
    }
}
