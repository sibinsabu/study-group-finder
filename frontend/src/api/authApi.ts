import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export interface UserDto {
  id: string;
  name: string;
  email: string;
  university: string;
  avatar: string;
  role?: 'student' | 'mentor';
  expertise?: string;
  title?: string;
  bio?: string;
  experienceYears?: number;
  linkedInOrWebsite?: string;
  rating?: number;
  joinedGroups: string[];
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: UserDto | null;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  university?: string;
  role?: 'student' | 'mentor';
  expertise?: string;
  title?: string;
  bio?: string;
  experienceYears?: number;
  linkedInOrWebsite?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  role?: 'student' | 'mentor';
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

export const authApi = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    try {
      const endpoint = payload.role === 'mentor' ? '/auth/mentor/register' : '/auth/register';
      const response = await apiClient.post<AuthResponse>(endpoint, payload);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        return {
          success: false,
          message: error.response.data.message,
          user: null,
        };
      }
      return {
        success: false,
        message: 'Could not connect to backend server. Please ensure Spring Boot is running.',
        user: null,
      };
    }
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    try {
      const endpoint = payload.role === 'mentor' ? '/auth/mentor/login' : '/auth/login';
      const response = await apiClient.post<AuthResponse>(endpoint, payload);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        return {
          success: false,
          message: error.response.data.message,
          user: null,
        };
      }
      return {
        success: false,
        message: 'Invalid credentials or backend unavailable.',
        user: null,
      };
    }
  },

  async mentorRegister(payload: Omit<RegisterPayload, 'role'>): Promise<AuthResponse> {
    return this.register({ ...payload, role: 'mentor' });
  },

  async mentorLogin(payload: Omit<LoginPayload, 'role'>): Promise<AuthResponse> {
    return this.login({ ...payload, role: 'mentor' });
  },

  async getUser(id: string): Promise<UserDto | null> {
    try {
      const response = await apiClient.get<UserDto>(`/auth/user/${id}`);
      return response.data;
    } catch {
      return null;
    }
  },

  async updateGroups(id: string, joinedGroups: string[]): Promise<UserDto | null> {
    try {
      const response = await apiClient.post<UserDto>(`/auth/user/${id}/groups`, { joinedGroups });
      return response.data;
    } catch {
      return null;
    }
  },

  async getSession(): Promise<AuthResponse> {
    try {
      const response = await apiClient.get<AuthResponse>('/auth/session');
      return response.data;
    } catch {
      return { success: false, message: 'No active session', user: null };
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    }
  },
};
