import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import type { UserDto, AuthResponse } from '../api/authApi';

export type User = UserDto & {
  major?: string;
  year?: string;
  bio?: string;
  interests?: string[];
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<AuthResponse>;
  register: (name: string, email: string, pass: string, university?: string) => Promise<AuthResponse>;
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => void;
  joinGroup: (groupId: string) => Promise<void>;
  leaveGroup: (groupId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('study_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('study_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('study_user');
    }
  }, [user]);

  const login = async (email: string, pass: string): Promise<AuthResponse> => {
    const response = await authApi.login({ email, password: pass });
    if (response.success && response.user) {
      setUser(response.user);
    }
    return response;
  };

  const register = async (name: string, email: string, pass: string, university?: string): Promise<AuthResponse> => {
    const response = await authApi.register({ name, email, password: pass, university });
    if (response.success && response.user) {
      setUser(response.user);
    }
    return response;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('study_user');
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updatedData };
    setUser(updated);
    localStorage.setItem('study_user', JSON.stringify(updated));
  };

  const joinGroup = async (groupId: string) => {
    if (!user) return;
    if (!user.joinedGroups.includes(groupId)) {
      const updatedGroups = [...user.joinedGroups, groupId];
      const updatedUser = { ...user, joinedGroups: updatedGroups };
      setUser(updatedUser);
      await authApi.updateGroups(user.id, updatedGroups);
    }
  };

  const leaveGroup = async (groupId: string) => {
    if (!user) return;
    const updatedGroups = user.joinedGroups.filter((id) => id !== groupId);
    const updatedUser = { ...user, joinedGroups: updatedGroups };
    setUser(updatedUser);
    await authApi.updateGroups(user.id, updatedGroups);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      updateProfile,
      joinGroup,
      leaveGroup
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
