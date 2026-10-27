<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sign In | StudySphere - Peer Collaboration Platform</title>
  <meta name="description" content="Sign in to your StudySphere administrator, mentor, or student account via Java Servlets and HttpSession." />
  <link rel="icon" type="image/svg+xml" href="favicon.svg" />
  <link rel="stylesheet" href="<%= request.getContextPath() %>/css/style.css" />
  <style>
    /* Fix browser autofill / autocomplete background & text color glitch */
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 1000px #f8fafc inset !important;
      -webkit-text-fill-color: #0b1a30 !important;
      transition: background-color 5000s ease-in-out 0s;
      caret-color: #0b1a30 !important;
    }
  </style>
</head>
<body>

  <div class="grid-bg">
    <div class="app-viewport">

      <!-- Navigation Header -->
      <header class="navbar" style="padding: 16px 32px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-light); background: #ffffff;">
        <a href="<%= request.getContextPath() %>/login.jsp" class="logo" style="display: flex; align-items: center; gap: 10px; font-family: var(--font-heading); font-weight: 800; font-size: 20px; color: var(--primary-navy); text-decoration: none;">
          <div style="width: 36px; height: 36px; border-radius: 10px; background: var(--primary-navy); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 18px;">S</div>
          <span>STUDYSPHERE</span>
        </a>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 13px; color: var(--text-muted); font-weight: 600;">Phase 4 &bull; Java Servlets &amp; HttpSession</span>
        </div>
      </header>

      <!-- Main Login Section -->
      <main class="auth-wrapper">
        <section class="auth-container" aria-labelledby="login-heading">

          <!-- Left Brand Panel -->
          <aside class="auth-brand-side">
            <div>
              <div class="auth-brand-logo">S</div>
              <h3>STUDYSPHERE</h3>
              <p>Peer collaboration and academic circle platform. Sign in with your registered credentials.</p>
            </div>

            <div style="width: 100%; border-top: 1px solid var(--border-medium); padding-top: 18px; margin-top: 24px; text-align: center;">
              <span style="display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; color: var(--accent-emerald);">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                Secure Server-Side Access
              </span>
            </div>
          </aside>

          <!-- Right Form Panel -->
          <div class="auth-form-side">
            <div class="auth-header">
              <h1 id="login-heading" style="font-size: 26px; font-weight: 900; color: var(--primary-navy); margin-bottom: 6px;">Sign In to Account</h1>
              <p style="font-size: 13px; color: var(--text-muted);">Enter your university credentials or administrator details below.</p>
            </div>

            <!-- Dynamic Server Alerts -->
            <%
              String errorMessage = (String) request.getAttribute("errorMessage");
              String usernameVal = (String) request.getAttribute("username");
              if (usernameVal == null) usernameVal = "";

              String paramError = request.getParameter("error");
              String paramLoggedOut = request.getParameter("loggedOut");

              if (errorMessage != null && !errorMessage.isBlank()) {
            %>
              <div class="alert-banner error" id="alert-error" style="display: flex;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                <span><%= errorMessage %></span>
              </div>
            <%
              } else if ("unauthorized".equals(paramError)) {
            %>
              <div class="alert-banner info" id="alert-unauthorized" style="display: flex;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <span><strong>Access Denied:</strong> Please log in to access the protected dashboard. Session checked by server.</span>
              </div>
            <%
              }

              if ("true".equals(paramLoggedOut)) {
            %>
              <div class="alert-banner success" id="alert-logout" style="display: flex;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <span><strong>Logged Out:</strong> Your session was securely invalidated on the server via <code>session.invalidate()</code>.</span>
              </div>
            <%
              }
            %>

            <!-- Standard HTTP POST Form to LoginServlet -->
            <form action="<%= request.getContextPath() %>/login" method="post" id="loginForm">
              <div class="form-group">
                <label for="username" class="form-label">Username or Email Address</label>
                <div class="input-container">
                  <span class="input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </span>
                  <input type="text" id="username" name="username" required placeholder="Enter your username or email" value="<%= usernameVal %>" autocomplete="username" autofocus />
                </div>
              </div>

              <div class="form-group">
                <label for="password" class="form-label">Password</label>
                <div class="input-container">
                  <span class="input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </span>
                  <input type="password" id="password" name="password" required placeholder="Enter your password" autocomplete="current-password" />
                </div>
              </div>

              <button type="submit" class="btn-primary" id="loginSubmitBtn" style="width: 100%; margin-top: 8px; padding: 13px 20px; font-size: 15px; font-weight: 800; border-radius: var(--radius-sm); background: var(--primary-navy); color: #ffffff; cursor: pointer; border: none; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: var(--shadow-md); transition: all 0.2s ease;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                Sign In
              </button>
            </form>

            <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--border-light); text-align: center; font-size: 12px; color: var(--text-muted); font-weight: 600;">
              StudySphere Enterprise Portal &bull; Server-Side Session Protected
            </div>
          </div>
        </section>
      </main>

    </div>
  </div>

</body>
</html>
