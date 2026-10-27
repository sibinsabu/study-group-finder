/**
 * StudySphere - Shared UI Utilities & Component Interactions
 */
import { authService } from './auth.js';

export function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}

export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Global Modal Backdrop and Escape Listener
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-backdrop.open').forEach((m) => {
      m.classList.remove('open');
    });
    document.body.style.overflow = '';
  }
});

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-backdrop')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/**
 * Renders the top navigation bar dynamically based on active page and login state.
 */
export function initNavbar(activePage = 'home') {
  const user = authService.getCurrentUser();
  const navPlaceholder = document.getElementById('main-navbar');
  if (!navPlaceholder) return;

  const isAuth = !!user;

  navPlaceholder.innerHTML = `
    <nav class="navbar" aria-label="Main Navigation">
      <a href="index.html" class="nav-brand" id="nav-brand-logo">
        <div class="brand-icon">
          <span class="brand-letter">S</span>
        </div>
        <div class="brand-text">
          <span class="brand-title">StudySphere</span>
          <div class="brand-subtitle">Collaborate & Excel</div>
        </div>
      </a>

      <div class="nav-search" id="nav-search-wrapper" style="${activePage === 'login' || activePage === 'register' ? 'display: none;' : ''}">
        <span class="search-icon">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>
        <input type="text" id="global-search-input" placeholder="Search courses, universities, or subjects..." aria-label="Search study groups" />
      </div>

      <ul class="nav-menu" id="nav-menu-list">
        <li><a href="index.html" class="nav-link ${activePage === 'home' ? 'active' : ''}" id="nav-link-home">Home</a></li>
        <li><a href="dashboard.html" class="nav-link ${activePage === 'dashboard' ? 'active' : ''}" id="nav-link-dashboard">Explore Circles</a></li>
        ${isAuth ? `
          <li><a href="my-groups.html" class="nav-link ${activePage === 'my-groups' ? 'active' : ''}" id="nav-link-mygroups">My Groups</a></li>
          <li><a href="profile.html" class="nav-link ${activePage === 'profile' ? 'active' : ''}" id="nav-link-profile">Profile</a></li>
        ` : ''}
      </ul>

      <div class="nav-auth-group" id="nav-auth-actions">
        ${isAuth ? `
          <a href="profile.html" class="nav-user-profile" id="nav-user-btn" title="View Profile">
            <img src="${user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}" alt="${user.name}" class="nav-avatar" />
            <div class="nav-user-info">
              <span class="nav-user-name">${user.name.split(' ')[0]}</span>
              <span class="nav-user-role">${user.role === 'mentor' ? 'Mentor' : 'Student'}</span>
            </div>
          </a>
          <button type="button" class="btn-secondary" id="btn-logout" title="Sign Out" style="padding: 7px 14px; font-size: 12px;">
            Logout
          </button>
        ` : `
          <a href="login.html" class="btn-outline ${activePage === 'login' ? 'active' : ''}" id="btn-nav-signin" style="padding: 8px 18px; font-size: 13px;">Sign In</a>
          <a href="register.html" class="btn-primary" id="btn-nav-register" style="padding: 8px 18px; font-size: 13px;">Register</a>
        `}
      </div>
    </nav>
  `;

  // Attach logout handler
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      authService.logout();
    });
  }

  // Attach search enter key handler
  const searchInput = document.getElementById('global-search-input');
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
          window.location.href = `dashboard.html?search=${encodeURIComponent(query)}`;
        }
      }
    });
  }
}
