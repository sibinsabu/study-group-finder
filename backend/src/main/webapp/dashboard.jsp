<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="com.app.studygroup.dto.UserDto" %>
<%
    // Section 8: Prevent browser caching of sensitive authenticated content
    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    response.setHeader("Pragma", "no-cache");
    response.setDateHeader("Expires", 0);

    // Section 6 & 7: Server-side authentication check
    String username = (String) session.getAttribute("username");
    String userId = (String) session.getAttribute("userId");
    UserDto currentUser = (UserDto) session.getAttribute("currentUser");

    if (username == null && (currentUser == null || currentUser.getUsername() == null)) {
        response.sendRedirect(request.getContextPath() + "/login.jsp?error=unauthorized");
        return;
    }
    if (username == null && currentUser != null) {
        username = currentUser.getUsername();
    }
    if (userId == null && currentUser != null) {
        userId = currentUser.getId();
    }

    String name = currentUser != null && currentUser.getName() != null ? currentUser.getName() : username;
    String email = currentUser != null && currentUser.getEmail() != null ? currentUser.getEmail() : (String) session.getAttribute("userEmail");
    String role = currentUser != null && currentUser.getRole() != null ? currentUser.getRole() : (String) session.getAttribute("role");
    if (role == null) role = "student";
    boolean isAdmin = "admin".equalsIgnoreCase(role) || Boolean.TRUE.equals(session.getAttribute("isAdmin"));
    Object privObj = session.getAttribute("privileges");
    java.util.List<String> privileges = null;
    if (privObj instanceof java.util.List<?>) {
        privileges = (java.util.List<String>) privObj;
    }
    String university = (String) session.getAttribute("university");
    if (university == null && currentUser != null && currentUser.getUniversity() != null) {
        university = currentUser.getUniversity();
    }
    if (university == null || university.isBlank() || "Academic University".equalsIgnoreCase(university) || "Stanford University".equalsIgnoreCase(university) || "Stanford".equalsIgnoreCase(university)) {
        university = "Kristu Jayanti Deemed to be University";
    }
    String sessionId = session.getId();
    String paramRegistered = request.getParameter("registered");
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>User Dashboard | StudySphere - Peer Collaboration Platform</title>
  <meta name="description" content="StudySphere User Dashboard running on Java Servlets, JSP, and HttpSession." />
  <link rel="icon" type="image/svg+xml" href="favicon.svg" />
  <link rel="stylesheet" href="<%= request.getContextPath() %>/css/style.css" />
  <style>
    .stat-strip {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 28px;
    }
    .stat-card-clean {
      background: #ffffff;
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      padding: 18px 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: var(--shadow-sm);
    }
    .stat-icon-box {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .stat-icon-box.navy { background: rgba(11, 26, 48, 0.08); color: var(--primary-navy); }
    .stat-icon-box.coral { background: rgba(235, 87, 87, 0.1); color: var(--accent-coral); }
    .stat-icon-box.emerald { background: rgba(16, 185, 129, 0.1); color: var(--accent-emerald); }
    .stat-icon-box.cyan { background: rgba(2, 132, 199, 0.1); color: var(--accent-cyan); }
    
    .dashboard-layout {
      display: grid;
      grid-template-columns: 360px 1fr;
      gap: 24px;
    }
    @media (max-width: 960px) {
      .dashboard-layout {
        grid-template-columns: 1fr;
      }
    }
    .panel-card {
      background: #ffffff;
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      padding: 24px;
      box-shadow: var(--shadow-sm);
      margin-bottom: 24px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 11px 0;
      border-bottom: 1px solid var(--border-light);
      font-size: 13px;
      gap: 16px;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      color: var(--text-muted);
      font-weight: 600;
      flex-shrink: 0;
      padding-top: 1px;
    }
    .info-value {
      color: var(--text-primary);
      font-weight: 700;
      text-align: right;
      word-break: normal;
      overflow-wrap: break-word;
      line-height: 1.45;
    }
    .info-value.session-id-val {
      font-family: monospace;
      font-size: 11px;
      color: var(--accent-cyan);
      word-break: break-all;
    }
    .circle-card {
      background: #ffffff;
      border: 1px solid var(--border-medium);
      border-radius: var(--radius-md);
      padding: 20px;
      margin-bottom: 16px;
      box-shadow: var(--shadow-xs);
      transition: all var(--transition-fast);
    }
    .circle-card:hover {
      box-shadow: var(--shadow-md);
      border-color: var(--primary-navy);
      transform: translateY(-2px);
    }
    .admin-role-highlight {
      color: var(--accent-coral) !important;
    }
  </style>
</head>
<body>

  <div class="grid-bg">
    <div class="app-viewport">

      <!-- Navigation Header -->
      <header class="navbar" style="padding: 16px 32px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-light); background: #ffffff;">
        <a href="<%= request.getContextPath() %>/dashboard.jsp" class="logo" style="display: flex; align-items: center; gap: 10px; font-family: var(--font-heading); font-weight: 800; font-size: 20px; color: var(--primary-navy); text-decoration: none;">
          <div style="width: 36px; height: 36px; border-radius: 10px; background: var(--primary-navy); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 18px;">S</div>
          <span>STUDYSPHERE</span>
        </a>

        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="display: flex; align-items: center; gap: 8px; background: var(--bg-main); padding: 5px 12px; border-radius: 9999px; font-size: 13px; font-weight: 700; color: var(--text-primary);">
            <div style="width: 24px; height: 24px; border-radius: 50%; background: var(--primary-navy); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 11px;">
              <%= username != null && !username.isEmpty() ? username.substring(0, 1).toUpperCase() : "U" %>
            </div>
            <span>@<%= username %></span>
          </div>

          <!-- Section 6: Standard Logout form with POST -->
          <form action="<%= request.getContextPath() %>/logout" method="post" style="margin: 0;" id="logoutForm">
            <button type="submit" class="btn-outline" id="logoutButton" style="padding: 7px 16px; font-size: 13px; color: var(--accent-coral); border-color: rgba(235, 87, 87, 0.4); display: flex; align-items: center; gap: 6px; cursor: pointer; background: transparent; border-radius: var(--radius-sm); font-weight: 700;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Logout
            </button>
          </form>
        </div>
      </header>

      <!-- Main Dashboard Container -->
      <main style="padding: 32px 32px 48px 32px;">

        <% if ("true".equals(paramRegistered)) { %>
          <div class="alert-banner success" style="display: flex; margin-bottom: 24px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <div>
              <strong>Welcome to StudySphere!</strong> Your account was created, validated, and authenticated via Java Servlets.
            </div>
          </div>
        <% } %>

        <!-- Welcome Banner (Section 6 Requirement) -->
        <div style="background: linear-gradient(135deg, var(--primary-navy) 0%, var(--primary-navy-dark) 100%); border-radius: var(--radius-lg); padding: 32px; color: #ffffff; margin-bottom: 28px; box-shadow: var(--shadow-md); position: relative; overflow: hidden;">
          <div style="position: relative; z-index: 2;">
            <div style="display: inline-block; padding: 4px 10px; background: rgba(255, 255, 255, 0.15); border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; color: #a5b4fc;">
              <%= role.toUpperCase() %> PORTAL &bull; APACHE TOMCAT
            </div>
            <h2 style="font-size: 28px; font-weight: 900; color: #ffffff; margin-bottom: 6px;">Welcome, <%= username %>!</h2>
            <p style="color: #cbd5e1; font-size: 14px;">You are logged in.</p>
          </div>
        </div>

        <!-- Metric Stat Strip -->
        <div class="stat-strip">
          <div class="stat-card-clean">
            <div class="stat-icon-box navy">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <div>
              <div style="font-size: 20px; font-weight: 900; color: var(--primary-navy);">6 Circles</div>
              <div style="font-size: 12px; color: var(--text-muted); font-weight: 600;">Active Campus Circles</div>
            </div>
          </div>

          <div class="stat-card-clean">
            <div class="stat-icon-box coral">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
            </div>
            <div>
              <div style="font-size: 20px; font-weight: 900; color: var(--primary-navy);">2 Enrolled</div>
              <div style="font-size: 12px; color: var(--text-muted); font-weight: 600;">My Study Circles</div>
            </div>
          </div>

          <div class="stat-card-clean">
            <div class="stat-icon-box emerald">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <div>
              <div style="font-size: 20px; font-weight: 900; color: var(--primary-navy);">Active</div>
              <div style="font-size: 12px; color: var(--text-muted); font-weight: 600;">HttpSession State</div>
            </div>
          </div>

          <div class="stat-card-clean">
            <div class="stat-icon-box cyan">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <div>
              <div style="font-size: 20px; font-weight: 900; color: var(--primary-navy);">Guarded</div>
              <div style="font-size: 12px; color: var(--text-muted); font-weight: 600;">Server-Side Access</div>
            </div>
          </div>
        </div>

        <!-- 2-Column Split: Session Card vs Study Groups -->
        <div class="dashboard-layout">

          <!-- Left Column: User & Session Details -->
          <div>
            <div class="panel-card">
              <h3 style="font-size: 16px; font-weight: 800; color: var(--primary-navy); margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                HttpSession Tracking
              </h3>

              <div class="info-row">
                <span class="info-label">Full Name</span>
                <span class="info-value"><%= name %></span>
              </div>
              <div class="info-row">
                <span class="info-label">Username</span>
                <span class="info-value">@<%= username %></span>
              </div>
              <div class="info-row">
                <span class="info-label">University</span>
                <span class="info-value"><%= university %></span>
              </div>
              <div class="info-row">
                <span class="info-label">Email</span>
                <span class="info-value"><%= email %></span>
              </div>
              <div class="info-row">
                <span class="info-label">Account Role</span>
                <span class="info-value <%= isAdmin ? "admin-role-highlight" : "" %>"><%= role.toUpperCase() %></span>
              </div>
              <% if (isAdmin) { %>
              <div class="info-row">
                <span class="info-label">Admin Privileges</span>
                <span class="info-value" style="color: var(--accent-emerald); font-size: 11px;">FULL ROOT PRIVILEGES</span>
              </div>
              <% } %>
              <div class="info-row">
                <span class="info-label">Session ID</span>
                <span class="info-value session-id-val"><%= sessionId %></span>
              </div>
              <div class="info-row">
                <span class="info-label">Session Status</span>
                <span class="info-value" style="color: var(--accent-emerald);">Authenticated &bull; Active</span>
              </div>

              <div style="margin-top: 20px;">
                <form action="<%= request.getContextPath() %>/logout" method="post">
                  <button type="submit" class="btn-outline" style="width: 100%; justify-content: center; padding: 10px; color: var(--accent-coral); border-color: rgba(235, 87, 87, 0.4); background: #fff; font-weight: 700; cursor: pointer; border-radius: var(--radius-sm); display: flex; align-items: center; gap: 6px;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    Terminate Session &amp; Logout
                  </button>
                </form>
              </div>
            </div>
          </div>

          <!-- Right Column: Admin Management (if admin) + Enrolled Study Circles -->
          <div>
            <% if (isAdmin) { %>
            <div class="panel-card" style="border-left: 4px solid var(--accent-coral); background: #ffffff;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                <h3 style="font-size: 16px; font-weight: 800; color: var(--primary-navy); display: flex; align-items: center; gap: 8px;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  Administrator Console &bull; Backend Privileges
                </h3>
                <span style="font-size: 11px; color: var(--accent-coral); font-weight: 800; background: rgba(235, 87, 87, 0.1); padding: 4px 10px; border-radius: 9999px;">ROOT ACCESS</span>
              </div>
              <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 14px;">
                Your account is authenticated with full backend administrative privileges.
              </p>
              <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;">
                <%
                  if (privileges != null && !privileges.isEmpty()) {
                    for (String priv : privileges) {
                %>
                  <span style="font-size: 11px; font-weight: 800; color: var(--primary-navy); background: var(--bg-main); border: 1px solid var(--border-medium); padding: 3px 8px; border-radius: 6px;">
                    &check; <%= priv %>
                  </span>
                <%
                    }
                  } else {
                %>
                  <span style="font-size: 11px; font-weight: 800; color: var(--primary-navy); background: var(--bg-main); border: 1px solid var(--border-medium); padding: 3px 8px; border-radius: 6px;">
                    &check; ALL_PRIVILEGES
                  </span>
                  <span style="font-size: 11px; font-weight: 800; color: var(--primary-navy); background: var(--bg-main); border: 1px solid var(--border-medium); padding: 3px 8px; border-radius: 6px;">
                    &check; MANAGE_USERS
                  </span>
                  <span style="font-size: 11px; font-weight: 800; color: var(--primary-navy); background: var(--bg-main); border: 1px solid var(--border-medium); padding: 3px 8px; border-radius: 6px;">
                    &check; MANAGE_CIRCLES
                  </span>
                  <span style="font-size: 11px; font-weight: 800; color: var(--primary-navy); background: var(--bg-main); border: 1px solid var(--border-medium); padding: 3px 8px; border-radius: 6px;">
                    &check; SYSTEM_ADMIN
                  </span>
                <% } %>
              </div>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; padding-top: 12px; border-top: 1px solid var(--border-light); font-size: 12px; color: var(--text-muted);">
                <div>&bull; Database: <strong style="color: var(--text-primary);">MongoDB (Connected)</strong></div>
                <div>&bull; Session Security: <strong style="color: var(--accent-emerald);">Rotation Active</strong></div>
                <div>&bull; Admin API: <strong style="color: var(--accent-cyan);">/api/auth/admin/*</strong></div>
              </div>
            </div>
            <% } %>

            <div class="panel-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="font-size: 16px; font-weight: 800; color: var(--primary-navy); display: flex; align-items: center; gap: 8px;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  Enrolled Study Circles
                </h3>
                <span style="font-size: 12px; color: var(--accent-emerald); font-weight: 700; background: rgba(16, 185, 129, 0.1); padding: 4px 10px; border-radius: 9999px;">2 Active Sprints</span>
              </div>

              <!-- Circle 1 -->
              <div class="circle-card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                  <div>
                    <span style="font-size: 11px; font-weight: 800; color: var(--accent-coral); text-transform: uppercase;">CS 244B</span>
                    <h4 style="font-size: 16px; font-weight: 800; color: var(--primary-navy); margin-top: 2px;">Distributed Systems &amp; Raft Consensus Sprint</h4>
                  </div>
                  <span style="font-size: 12px; font-weight: 700; color: var(--text-muted); background: var(--bg-main); padding: 3px 8px; border-radius: 6px;">5 / 6 Members</span>
                </div>
                <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 12px;">
                  Weekly group sprint focused on consensus protocols, distributed storage, and RPC mechanics in Go.
                </p>
                <div style="display: flex; gap: 12px; font-size: 12px; color: var(--text-muted); font-weight: 600;">
                  <span>&bull; Thursdays 6:00 PM</span>
                  <span>&bull; Gates Computer Science 392</span>
                </div>
              </div>

              <!-- Circle 2 -->
              <div class="circle-card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                  <div>
                    <span style="font-size: 11px; font-weight: 800; color: var(--accent-cyan); text-transform: uppercase;">CS 161</span>
                    <h4 style="font-size: 16px; font-weight: 800; color: var(--primary-navy); margin-top: 2px;">Design &amp; Analysis of Algorithms</h4>
                  </div>
                  <span style="font-size: 12px; font-weight: 700; color: var(--text-muted); background: var(--bg-main); padding: 3px 8px; border-radius: 6px;">4 / 8 Members</span>
                </div>
                <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 12px;">
                  Midterm problem set review covering dynamic programming, amortized analysis, and network flows.
                </p>
                <div style="display: flex; gap: 12px; font-size: 12px; color: var(--text-muted); font-weight: 600;">
                  <span>&bull; Tuesdays 4:30 PM</span>
                  <span>&bull; Online Room (Discord)</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </main>

    </div>
  </div>

</body>
</html>
