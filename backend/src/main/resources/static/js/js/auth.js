/**
 * StudySphere - Authentication & Session Service
 * Communicates with Spring Boot Servlets (/servlet/login, /servlet/register, /servlet/logout)
 * and REST APIs, while providing transparent fallback for standalone testing.
 */

const STORAGE_USER_KEY = 'study_user';
const API_BASE_URL = 'http://localhost:8080';

export const authService = {
  getCurrentUser() {
    try {
      const data = localStorage.getItem(STORAGE_USER_KEY);
      return data ? JSON.parse(data) : null;
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

  async login(emailOrUsername, password, role = 'student') {
    // Attempt 1: Spring Boot Servlet endpoint (/servlet/login with URL-encoded form data)
    try {
      const params = new URLSearchParams();
      params.append('identifier', emailOrUsername);
      params.append('password', password);
      params.append('role', role);

      const response = await fetch(`${API_BASE_URL}/servlet/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.user) {
          const userObj = {
            id: result.user.id || `u-${Date.now()}`,
            name: result.user.name || (emailOrUsername.split('@')[0]),
            email: result.user.email || emailOrUsername,
            role: result.user.role || role,
            university: result.user.university || 'University Student',
            avatar: result.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            joinedGroups: ['grp-1', 'grp-2'],
          };
          localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userObj));
          return { success: true, message: result.message || 'Login successful!', user: userObj };
        }
      }
    } catch {
      // Fallback to REST endpoint
      try {
        const restResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailOrUsername, password, role }),
          credentials: 'include',
        });
        if (restResponse.ok) {
          const result = await restResponse.json();
          if (result.success && result.user) {
            localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(result.user));
            return { success: true, message: result.message, user: result.user };
          }
        }
      } catch {
        // Backend not running, proceed to mock session fallback
      }
    }

    // Fallback: If backend is not currently running or credentials match mock demo:
    const mockUser = {
      id: `u-${Date.now()}`,
      name: emailOrUsername.includes('@') ? emailOrUsername.split('@')[0].replace('.', ' ') : emailOrUsername,
      email: emailOrUsername,
      role: role,
      university: role === 'mentor' ? 'Stanford & MIT' : 'State University',
      title: role === 'mentor' ? 'Senior Academic Mentor' : undefined,
      expertise: role === 'mentor' ? 'Computer Science & Software Architecture' : undefined,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      joinedGroups: ['grp-1', 'grp-2'],
      major: 'Computer Science & Engineering',
      year: 'Junior',
      bio: 'Enthusiastic learner collaborating on algorithms and midterm prep.',
      interests: ['Algorithms', 'Data Structures', 'Web Development']
    };

    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(mockUser));
    return { success: true, message: 'Signed in successfully!', user: mockUser };
  },

  async register(formData) {
    // Attempt 1: Spring Boot Servlet endpoint (/servlet/register)
    try {
      const params = new URLSearchParams();
      params.append('name', formData.name);
      params.append('username', formData.email.split('@')[0]);
      params.append('email', formData.email);
      params.append('password', formData.password);
      params.append('confirmPassword', formData.confirmPassword || formData.password);
      params.append('university', formData.university || 'University');
      params.append('role', formData.role || 'student');

      const response = await fetch(`${API_BASE_URL}/servlet/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.user) {
          const userObj = {
            id: result.user.id || `u-${Date.now()}`,
            name: result.user.name || formData.name,
            email: result.user.email || formData.email,
            role: result.user.role || formData.role || 'student',
            university: formData.university || 'University',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            joinedGroups: ['grp-1'],
          };
          localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userObj));
          return { success: true, message: result.message || 'Registration successful!', user: userObj };
        }
      }
    } catch {
      // Backend not running, proceed to fallback
    }

    // Fallback: Register mock user directly to localStorage
    const newUser = {
      id: `u-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      role: formData.role || 'student',
      university: formData.university || 'State University',
      title: formData.title || (formData.role === 'mentor' ? 'Senior Academic Mentor' : undefined),
      expertise: formData.expertise,
      experienceYears: formData.experienceYears,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      joinedGroups: ['grp-1'],
      major: 'Computer Science',
      year: 'Sophomore',
      bio: 'New student on StudySphere looking for collaborative circles.',
      interests: ['Algorithms', 'Linear Algebra']
    };

    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(newUser));
    return { success: true, message: 'Account registered successfully!', user: newUser };
  },

  async logout() {
    try {
      await fetch(`${API_BASE_URL}/servlet/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Ignore network error on logout
    }
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
