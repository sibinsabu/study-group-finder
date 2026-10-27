<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Create Account | StudySphere - Peer Collaboration Platform</title>
  <meta name="description" content="Register your verified university student or mentor account on StudySphere via Java Servlets." />
  <link rel="icon" type="image/svg+xml" href="favicon.svg" />
  <link rel="stylesheet" href="<%= request.getContextPath() %>/css/style.css" />
  <style>
    /* Prevent browser autofill background & text glitch */
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 1000px #f8fafc inset !important;
      -webkit-text-fill-color: #0b1a30 !important;
      transition: background-color 5000s ease-in-out 0s;
      caret-color: #0b1a30 !important;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    @media (max-width: 600px) {
      .grid-2 {
        grid-template-columns: 1fr;
        gap: 0;
      }
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
          <span style="font-size: 13px; color: var(--text-muted);">Phase 4 &bull; Servlet &amp; Session</span>
          <a href="<%= request.getContextPath() %>/login.jsp" class="btn-outline" style="font-size: 13px; padding: 7px 18px;">Sign In</a>
        </div>
      </header>

      <!-- Main Register Section -->
      <main class="auth-wrapper">
        <section class="auth-container" aria-labelledby="register-heading">

          <!-- Left Brand Panel -->
          <aside class="auth-brand-side">
            <div>
              <div class="auth-brand-logo">S</div>
              <h3>STUDYSPHERE</h3>
              <p>Accelerate your academic journey with vetted peers, midterm sprint circles, and graduate mentors.</p>
            </div>

            <div style="width: 100%; border-top: 1px solid var(--border-medium); padding-top: 18px; margin-top: 24px;">
              <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">Already registered?</p>
              <a href="<%= request.getContextPath() %>/login.jsp" class="btn-outline" style="font-size: 13px; padding: 9px 18px; width: 100%; text-align: center; display: block;">
                Sign In to Account
              </a>
            </div>
          </aside>

          <!-- Right Form Panel -->
          <div class="auth-form-side">
            <div class="auth-header">
              <h1 id="register-heading" style="font-size: 26px; font-weight: 900; color: var(--primary-navy); margin-bottom: 6px;">Create Account</h1>
              <p style="font-size: 13px; color: var(--text-muted);">Register via Java Servlet with Server-Side Validation &amp; BCrypt Security.</p>
            </div>

            <%
              String errorMessage = (String) request.getAttribute("errorMessage");
              String name = (String) request.getAttribute("name");
              String username = (String) request.getAttribute("username");
              String email = (String) request.getAttribute("email");
              String university = (String) request.getAttribute("university");
              String role = (String) request.getAttribute("role");

              if (name == null) name = "";
              if (username == null) username = "";
              if (email == null) email = "";
              if (university == null) university = "";
              if (role == null) role = "student";

              if (errorMessage != null && !errorMessage.isBlank()) {
            %>
              <div class="alert-banner error" id="alert-error" style="display: flex;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                <span><%= errorMessage %></span>
              </div>
            <%
              }
            %>

            <!-- Role Selector Toggle -->
            <div class="role-toggle-bar">
              <span class="role-badge-text">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
                <span id="role-label-text">Select Account Type</span>
              </span>

              <div class="role-btn-group">
                <button type="button" class="role-btn <%= "student".equalsIgnoreCase(role) ? "active student" : "" %>" id="btn-role-student" onclick="setRole('student')">Student</button>
                <button type="button" class="role-btn <%= "mentor".equalsIgnoreCase(role) ? "active mentor" : "" %>" id="btn-role-mentor" onclick="setRole('mentor')">Mentor / TA</button>
              </div>
            </div>

            <!-- Standard HTTP POST Form to RegisterServlet -->
            <form action="<%= request.getContextPath() %>/register" method="post" id="registerForm">
              <input type="hidden" name="role" id="role-input" value="<%= role %>">

              <div class="grid-2">
                <div class="form-group">
                  <label for="name" class="form-label">Full Name</label>
                  <div class="input-container">
                    <span class="input-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </span>
                    <input type="text" id="name" name="name" required placeholder="e.g. Alex Johnson" value="<%= name %>" autocomplete="name" />
                  </div>
                </div>

                <div class="form-group">
                  <label for="username" class="form-label">Username</label>
                  <div class="input-container">
                    <span class="input-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path></svg>
                    </span>
                    <input type="text" id="username" name="username" required placeholder="e.g. alexjohnson" value="<%= username %>" autocomplete="username" />
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label for="email" class="form-label">University Email</label>
                <div class="input-container">
                  <span class="input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </span>
                  <input type="email" id="email" name="email" required placeholder="alex@stanford.edu" value="<%= email %>" autocomplete="email" />
                </div>
              </div>

              <div class="grid-2">
                <div class="form-group">
                  <label for="password" class="form-label">Password</label>
                  <div class="input-container">
                    <span class="input-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </span>
                    <input type="password" id="password" name="password" required minlength="6" placeholder="Min. 6 characters" autocomplete="new-password" />
                  </div>
                </div>

                <div class="form-group">
                  <label for="confirmPassword" class="form-label">Confirm Password</label>
                  <div class="input-container">
                    <span class="input-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </span>
                    <input type="password" id="confirmPassword" name="confirmPassword" required minlength="6" placeholder="Re-enter password" autocomplete="new-password" />
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label for="university" class="form-label">University / College</label>
                <div class="input-container">
                  <span class="input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3l2-4h14l2 4z"></path></svg>
                  </span>
                  <input type="text" id="university" name="university" placeholder="e.g. Kristu Jayanti Deemed to be University" value="<%= university %>" />
                </div>
              </div>

              <button type="submit" class="btn-primary" id="registerSubmitBtn" style="width: 100%; margin-top: 8px; padding: 13px 20px; font-size: 15px; font-weight: 800; border-radius: var(--radius-sm); background: var(--primary-navy); color: #ffffff; cursor: pointer; border: none; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: var(--shadow-md); transition: all 0.2s ease;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                Create Account
              </button>
            </form>

            <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--border-light); text-align: center; font-size: 13px; color: var(--text-muted);">
              Already have an account? 
              <a href="<%= request.getContextPath() %>/login.jsp" style="color: var(--accent-coral); font-weight: 700; text-decoration: none;">Sign in here</a>
            </div>
          </div>
        </section>
      </main>

    </div>
  </div>

  <script>
    function setRole(selectedRole) {
      document.getElementById('role-input').value = selectedRole;
      var studentBtn = document.getElementById('btn-role-student');
      var mentorBtn = document.getElementById('btn-role-mentor');
      if (selectedRole === 'student') {
        studentBtn.className = 'role-btn active student';
        mentorBtn.className = 'role-btn';
      } else {
        studentBtn.className = 'role-btn';
        mentorBtn.className = 'role-btn active mentor';
      }
    }
  </script>

</body>
</html>
