/**
 * StudySphere - Authentication & Session Service
 * Secure client service connected directly to Spring Boot REST APIs (/api/auth)
 * and Servlets (/servlet). Strictly validates credentials against backend MongoDB.
 */

const STORAGE_USER_KEY = 'study_user';

// Determine backend URL dynamically:
// - If loaded from Spring Boot (port 8080), use relative origin (no CORS needed)
// - If loaded from Vite dev server (port 5173 or other), route to http://<hostname>:8080
export const API_BASE_URL = (() => {
  if (typeof window === 'undefined') return 'http://localhost:8080';
  const { protocol, hostname, port } = window.location;
  if (port === '8080') return '';
  return `${protocol}//${hostname || 'localhost'}:8080`;
})();

export const authService = {
  getCurrentUser() {
    try {
      const data = localStorage.getItem(STORAGE_USER_KEY);
      if (!data) return null;
      const user = JSON.parse(data);
      // Invalidate legacy mock users that were generated without backend persistence
      if (user && typeof user.id === 'string' && user.id.startsWith('u-')) {
        localStorage.removeItem(STORAGE_USER_KEY);
        return null;
      }
      return user;
    } catch {
      return null;
    }
  },

  isLoggedIn() {
    return !!this.getCurrentUser();
  },

  isMentor() {
    const user = this.getCurrentUser();
    return user?.role === 'mentor';
  },

  /**
   * Pre-check if an email is registered in MongoDB.
   * Useful for informing users before or during login/registration.
   */
  async checkUserRegistered(email) {
    if (!email || !email.trim()) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/check-email?email=${encodeURIComponent(email.trim())}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        credentials: 'include',
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend check-email failed:', e);
    }
    return null;
  },

  /**
   * Authenticate user against backend MongoDB.
   * STRICT: Validates if the user exists, matches password, and checks role.
   * NEVER generates mock/fake users on failure.
   */
  async login(emailOrUsername, password, role = 'student') {
    const trimmedId = (emailOrUsername || '').trim();
    const cleanPassword = password || '';

    if (!trimmedId) {
      return { success: false, message: 'Please enter your email or username.' };
    }
    if (!cleanPassword) {
      return { success: false, message: 'Please enter your password.' };
    }

    let networkError = null;

    // Primary: Standard REST endpoint (/api/auth/login)
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: trimmedId,
          username: trimmedId,
          password: cleanPassword,
          role: role,
        }),
        credentials: 'include',
      });

      const result = await response.json().catch(() => null);

      if (response.ok && result?.success && result.user) {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(result.user));
        return {
          success: true,
          message: result.message || 'Login successful!',
          user: result.user,
        };
      }

      // Backend explicitly responded with error (401 Unauthorized, 400 Bad Request, etc.)
      if (result && result.message) {
        const notReg = result.message.toLowerCase().includes('not registered') ||
                       result.message.toLowerCase().includes('no account') ||
                       result.message.toLowerCase().includes('create an account');
        return {
          success: false,
          message: result.message,
          notRegistered: notReg,
        };
      }

      if (!response.ok) {
        return {
          success: false,
          message: 'Invalid credentials or user not registered. Please check your information.',
        };
      }
    } catch (err) {
      networkError = err;
    }

    // Secondary: Servlet endpoint (/servlet/login with URL-encoded form data)
    try {
      const params = new URLSearchParams();
      params.append('identifier', trimmedId);
      params.append('password', cleanPassword);
      params.append('role', role);

      const response = await fetch(`${API_BASE_URL}/servlet/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: params.toString(),
        credentials: 'include',
      });

      const result = await response.json().catch(() => null);

      if (response.ok && result?.success && result.user) {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(result.user));
        return {
          success: true,
          message: result.message || 'Login successful!',
          user: result.user,
        };
      }

      if (result && result.message) {
        const notReg = result.message.toLowerCase().includes('not registered') ||
                       result.message.toLowerCase().includes('no account') ||
                       result.message.toLowerCase().includes('create an account');
        return {
          success: false,
          message: result.message,
          notRegistered: notReg,
        };
      }

      if (!response.ok) {
        return {
          success: false,
          message: 'Authentication failed. Please verify your credentials or register a new account.',
        };
      }
    } catch (err) {
      networkError = err;
    }

    // Both endpoints failed due to network / server unreachable
    return {
      success: false,
      message: `Unable to connect to the backend server at ${API_BASE_URL || window.location.origin}. Please ensure the Spring Boot server is running on port 8080.`,
      networkError: true,
    };
  },

  /**
   * Register a new user in backend MongoDB.
   * NEVER generates mock/fake users on failure.
   */
  async register(formData) {
    if (!formData?.email || !formData?.password) {
      return { success: false, message: 'Email and password are required.' };
    }

    let networkError = null;

    // Primary: REST endpoint (/api/auth/register)
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username || formData.email.split('@')[0],
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword || formData.password,
          university: formData.university || 'State University',
          role: formData.role || 'student',
          title: formData.title,
          expertise: formData.expertise,
          experienceYears: formData.experienceYears,
          bio: formData.bio,
          linkedInOrWebsite: formData.linkedInOrWebsite,
        }),
        credentials: 'include',
      });

      const result = await response.json().catch(() => null);

      if (response.ok && result?.success && result.user) {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(result.user));
        return {
          success: true,
          message: result.message || 'Registration successful!',
          user: result.user,
        };
      }

      if (result && result.message) {
        return { success: false, message: result.message };
      }

      if (!response.ok) {
        return { success: false, message: 'Registration failed. An account with this email may already exist.' };
      }
    } catch (err) {
      networkError = err;
    }

    // Secondary: Servlet endpoint (/servlet/register)
    try {
      const params = new URLSearchParams();
      params.append('name', formData.name);
      params.append('username', formData.username || formData.email.split('@')[0]);
      params.append('email', formData.email);
      params.append('password', formData.password);
      params.append('confirmPassword', formData.confirmPassword || formData.password);
      params.append('university', formData.university || 'State University');
      params.append('role', formData.role || 'student');

      const response = await fetch(`${API_BASE_URL}/servlet/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: params.toString(),
        credentials: 'include',
      });

      const result = await response.json().catch(() => null);

      if (response.ok && result?.success && result.user) {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(result.user));
        return {
          success: true,
          message: result.message || 'Registration successful!',
          user: result.user,
        };
      }

      if (result && result.message) {
        return { success: false, message: result.message };
      }
    } catch (err) {
      networkError = err;
    }

    return {
      success: false,
      message: `Unable to connect to the backend server at ${API_BASE_URL || window.location.origin}. Please ensure Spring Boot is running.`,
      networkError: true,
    };
  },

  /**
   * Verify active session against backend HttpSession.
   */
  async verifySession() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/session`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data.user));
          return data.user;
        }
      }
    } catch {}
    return null;
  },

  async logout() {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {}
    try {
      await fetch(`${API_BASE_URL}/servlet/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {}
    localStorage.removeItem(STORAGE_USER_KEY);
    window.location.href = 'login.html';
  },

  updateProfile(updates) {
    const current = this.getCurrentUser();
    if (!current) return null;
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updated));
    return updated;
  },

  requireAuth(redirectUrl = 'login.html') {
    const user = this.getCurrentUser();
    if (!user) {
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  }
};
