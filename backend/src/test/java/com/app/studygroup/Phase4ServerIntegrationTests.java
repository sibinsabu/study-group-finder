package com.app.studygroup;

import com.app.studygroup.repository.UserRepository;
import com.app.studygroup.service.AuthService;
import com.app.studygroup.servlet.AuthenticationFilter;
import com.app.studygroup.servlet.DashboardServlet;
import com.app.studygroup.servlet.LoginServlet;
import com.app.studygroup.servlet.LogoutServlet;
import com.app.studygroup.servlet.RegisterServlet;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletConfig;
import jakarta.servlet.ServletException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.mock.web.MockServletConfig;
import org.springframework.web.context.WebApplicationContext;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Phase 4: Server-Side Integration and Execution Test Suite
 * Validates the full testing checklist from Student Notes Section 11:
 * 1. Register with valid information -> Account created, session created, confirmation shown.
 * 2. Register with an existing username -> Duplicate account is rejected.
 * 3. Login with valid credentials -> Session created, user reaches dashboard.
 * 4. Login with invalid credentials -> Access denied, generic error shown.
 * 5. Open dashboard without login -> Redirects to login with access-denied response.
 * 6. Logout -> Session invalidated and user redirected to login.
 * 7. Open dashboard after logout -> Access denied until login again.
 */
@SpringBootTest
public class Phase4ServerIntegrationTests {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    private RegisterServlet registerServlet;
    private LoginServlet loginServlet;
    private LogoutServlet logoutServlet;
    private DashboardServlet dashboardServlet;
    private AuthenticationFilter authFilter;

    @BeforeEach
    void setUp() throws ServletException {
        ServletConfig config = new MockServletConfig(webApplicationContext.getServletContext());

        registerServlet = new RegisterServlet();
        registerServlet.init(config);

        loginServlet = new LoginServlet();
        loginServlet.init(config);

        logoutServlet = new LogoutServlet();
        logoutServlet.init(config);

        dashboardServlet = new DashboardServlet();
        dashboardServlet.init(config);

        authFilter = new AuthenticationFilter();
        authFilter.init(null);
    }

    @Test
    @DisplayName("1. Register with valid information - Account created & session established")
    void test1_RegisterWithValidInformation() throws ServletException, IOException {
        String testUser = "testuser_" + System.currentTimeMillis();
        String testEmail = testUser + "@university.edu";

        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/register");
        MockHttpServletResponse response = new MockHttpServletResponse();

        request.setParameter("name", "Test Student");
        request.setParameter("username", testUser);
        request.setParameter("email", testEmail);
        request.setParameter("password", "Pass1234!");
        request.setParameter("confirmPassword", "Pass1234!");
        request.setParameter("university", "Stanford University");
        request.setParameter("role", "student");

        registerServlet.service(request, response);

        // Verification: User reached dashboard with registered flag or redirected
        assertTrue(response.isCommitted() || response.getRedirectedUrl() != null);
        assertNotNull(response.getRedirectedUrl());
        assertTrue(response.getRedirectedUrl().contains("dashboard.jsp?registered=true"));

        // Verify session was created and contains user attributes
        assertNotNull(request.getSession(false));
        assertEquals(testUser, request.getSession(false).getAttribute("username"));
        assertNotNull(request.getSession(false).getAttribute("userId"));

        // Verify database persistence
        assertTrue(userRepository.existsByEmail(testEmail));
        assertTrue(userRepository.existsByUsername(testUser));
    }

    @Test
    @DisplayName("2. Register with an existing username - Duplicate account rejected")
    void test2_RegisterWithExistingUsername() throws ServletException, IOException {
        String duplicateUser = "dupuser_" + System.currentTimeMillis();
        String email1 = duplicateUser + "1@university.edu";
        String email2 = duplicateUser + "2@university.edu";

        // First registration
        MockHttpServletRequest request1 = new MockHttpServletRequest("POST", "/register");
        MockHttpServletResponse response1 = new MockHttpServletResponse();
        request1.setParameter("name", "User One");
        request1.setParameter("username", duplicateUser);
        request1.setParameter("email", email1);
        request1.setParameter("password", "Pass1234!");
        request1.setParameter("confirmPassword", "Pass1234!");
        registerServlet.service(request1, response1);

        // Second registration with same username but different email
        MockHttpServletRequest request2 = new MockHttpServletRequest("POST", "/register");
        MockHttpServletResponse response2 = new MockHttpServletResponse();
        request2.setParameter("name", "User Two");
        request2.setParameter("username", duplicateUser);
        request2.setParameter("email", email2);
        request2.setParameter("password", "Pass1234!");
        request2.setParameter("confirmPassword", "Pass1234!");
        registerServlet.service(request2, response2);

        // Verification: Error message set on request & forward to register.jsp
        Object errorMessage = request2.getAttribute("errorMessage");
        assertNotNull(errorMessage, "Error message should be set for duplicate username");
        assertTrue(errorMessage.toString().toLowerCase().contains("already exists"));
        assertEquals("/register.jsp", response2.getForwardedUrl());
    }

    @Test
    @DisplayName("3. Login with valid credentials - Session created & user reaches dashboard")
    void test3_LoginWithValidCredentials() throws ServletException, IOException {
        String testUser = "validlogin_" + System.currentTimeMillis();
        String testEmail = testUser + "@university.edu";
        String password = "StrongPassword99!";

        // Pre-register user
        MockHttpServletRequest regReq = new MockHttpServletRequest("POST", "/register");
        MockHttpServletResponse regRes = new MockHttpServletResponse();
        regReq.setParameter("name", "Valid User");
        regReq.setParameter("username", testUser);
        regReq.setParameter("email", testEmail);
        regReq.setParameter("password", password);
        regReq.setParameter("confirmPassword", password);
        registerServlet.service(regReq, regRes);

        // Execute Login
        MockHttpServletRequest loginReq = new MockHttpServletRequest("POST", "/login");
        MockHttpServletResponse loginRes = new MockHttpServletResponse();
        loginReq.setParameter("username", testUser);
        loginReq.setParameter("password", password);

        loginServlet.service(loginReq, loginRes);

        // Verification: Redirect to dashboard.jsp
        assertEquals(requestUriWithContext(loginReq, "/dashboard.jsp"), loginRes.getRedirectedUrl());

        // Verification: Session attributes created (userId, username, currentUser)
        MockHttpSession session = (MockHttpSession) loginReq.getSession(false);
        assertNotNull(session, "HttpSession must exist after valid login");
        assertEquals(testUser, session.getAttribute("username"));
        assertNotNull(session.getAttribute("userId"));
        assertNotNull(session.getAttribute("currentUser"));
    }

    @Test
    @DisplayName("3b. Login with Default Admin Account - sibinkulathingal@gmail.com / iuad5939")
    void test3b_LoginWithDefaultAdminAccount() throws ServletException, IOException {
        MockHttpServletRequest loginReq = new MockHttpServletRequest("POST", "/login");
        MockHttpServletResponse loginRes = new MockHttpServletResponse();
        loginReq.setParameter("username", "sibinkulathingal@gmail.com");
        loginReq.setParameter("password", "iuad5939");

        loginServlet.service(loginReq, loginRes);

        // Verification: Redirect to dashboard.jsp
        assertEquals(requestUriWithContext(loginReq, "/dashboard.jsp"), loginRes.getRedirectedUrl());

        // Verification: Session attributes & admin privileges
        MockHttpSession session = (MockHttpSession) loginReq.getSession(false);
        assertNotNull(session, "HttpSession must exist for admin login");
        assertEquals("admin", session.getAttribute("role"));
        assertTrue(Boolean.TRUE.equals(session.getAttribute("isAdmin")));
        assertNotNull(session.getAttribute("privileges"));
        assertTrue(authService.hasAdminPrivileges(session));
        assertNotNull(session.getAttribute("userId"));
    }

    @Test
    @DisplayName("4. Login with invalid credentials - Access denied & generic error shown")
    void test4_LoginWithInvalidCredentials() throws ServletException, IOException {
        MockHttpServletRequest loginReq = new MockHttpServletRequest("POST", "/login");
        MockHttpServletResponse loginRes = new MockHttpServletResponse();
        loginReq.setParameter("username", "non_existent_user_9999");
        loginReq.setParameter("password", "wrongPassword!");

        loginServlet.service(loginReq, loginRes);

        // Verification: Forwarded to login.jsp with error message
        assertEquals("/login.jsp", loginRes.getForwardedUrl());
        Object errorMessage = loginReq.getAttribute("errorMessage");
        assertNotNull(errorMessage, "Error message must be present");
        assertTrue(errorMessage.toString().toLowerCase().contains("no account") 
                || errorMessage.toString().toLowerCase().contains("denied")
                || errorMessage.toString().toLowerCase().contains("incorrect"));
    }

    @Test
    @DisplayName("5. Open dashboard without login - Redirects to login with access-denied response")
    void test5_OpenDashboardWithoutLogin() throws ServletException, IOException {
        // Direct request to DashboardServlet without session
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/dashboard");
        MockHttpServletResponse response = new MockHttpServletResponse();

        dashboardServlet.service(request, response);

        // Verification: Redirects to login.jsp with error=unauthorized
        assertNotNull(response.getRedirectedUrl());
        assertTrue(response.getRedirectedUrl().contains("/login.jsp?error=unauthorized"));

        // Direct request to /dashboard.jsp through AuthenticationFilter without session
        MockHttpServletRequest filterReq = new MockHttpServletRequest("GET", "/dashboard.jsp");
        MockHttpServletResponse filterRes = new MockHttpServletResponse();
        FilterChain filterChain = new MockFilterChain();

        authFilter.doFilter(filterReq, filterRes, filterChain);

        // Verification: Filter intercepts and redirects to login.jsp
        assertNotNull(filterRes.getRedirectedUrl());
        assertTrue(filterRes.getRedirectedUrl().contains("/login.jsp?error=unauthorized"));
    }

    @Test
    @DisplayName("6. Logout - Session is invalidated and user is redirected to login")
    void test6_LogoutSessionInvalidation() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/logout");
        MockHttpServletResponse response = new MockHttpServletResponse();

        MockHttpSession session = new MockHttpSession();
        session.setAttribute("userId", "12345");
        session.setAttribute("username", "testuser");
        request.setSession(session);

        logoutServlet.service(request, response);

        // Verification: Session is invalidated
        assertTrue(session.isInvalid(), "HttpSession must be invalidated via session.invalidate()");

        // Verification: Redirect to login.jsp with loggedOut parameter
        assertNotNull(response.getRedirectedUrl());
        assertTrue(response.getRedirectedUrl().contains("/login.jsp?loggedOut=true"));

        // Verification: Cache control headers are set
        assertEquals("no-cache, no-store, must-revalidate", response.getHeader("Cache-Control"));
    }

    @Test
    @DisplayName("7. Open dashboard after logout - Access is denied until login again")
    void test7_OpenDashboardAfterLogout() throws ServletException, IOException {
        // Create session
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("userId", "12345");
        session.setAttribute("username", "testuser");

        // Logout
        MockHttpServletRequest logoutReq = new MockHttpServletRequest("POST", "/logout");
        MockHttpServletResponse logoutRes = new MockHttpServletResponse();
        logoutReq.setSession(session);
        logoutServlet.service(logoutReq, logoutRes);
        assertTrue(session.isInvalid());

        // Attempt to access dashboard with invalidated session
        MockHttpServletRequest dashReq = new MockHttpServletRequest("GET", "/dashboard");
        MockHttpServletResponse dashRes = new MockHttpServletResponse();
        dashReq.setSession(session); // Expired / invalidated session

        dashboardServlet.service(dashReq, dashRes);

        // Verification: Access denied and redirected to login.jsp
        assertNotNull(dashRes.getRedirectedUrl());
        assertTrue(dashRes.getRedirectedUrl().contains("/login.jsp?error=unauthorized"));
    }

    private String requestUriWithContext(MockHttpServletRequest req, String path) {
        return (req.getContextPath() != null ? req.getContextPath() : "") + path;
    }
}
