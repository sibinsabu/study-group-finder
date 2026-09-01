import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export interface UserDto {
  id: string;
  name: string;
  email: string;
  university: string;
  avatar: string;
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
}

export interface LoginPayload {
  email: string;
  password: string;
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
      const response = await apiClient.post<AuthResponse>('/auth/register', payload);
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
      const response = await apiClient.post<AuthResponse>('/auth/login', payload);
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
};
