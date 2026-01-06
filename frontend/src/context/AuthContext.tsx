// @ts-nocheck
import React, { createContext, useContext, useEffect, useState } from "react";
import api, { setToken as apiSetToken, clearToken as apiClearToken } from "../services/api";
import type { User } from "../types/api";

type Context = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, recaptcha: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<Context | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  async function login(email: string, password: string, recaptcha: string): Promise<boolean> {
    console.log('🔵 [AuthContext] login() called');
    console.log('📍 API URL:', api.defaults.baseURL);
    console.log('📦 Payload details:');
    console.log('   - login:', email);
    console.log('   - pass length:', password.length, 'chars');
    console.log('   - pass value:', password); // TEMPORARY DEBUG - REMOVE AFTER
    console.log('   - token_recaptcha length:', recaptcha.length, 'chars');
    
    try {
      console.log('📤 [AuthContext] Sending POST /auth/login...');
      const res = await api.post("/auth/login", { 
        login: email, 
        pass: password, 
        token_recaptcha: recaptcha 
      });
      console.log('✅ [AuthContext] Response received:', res.status, res.data);
      
      const token = res.data?.token;
      const userData = res.data?.user;
      if (token) {
        apiSetToken(token);
        setUser(userData ?? null);
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('❌ [AuthContext] Login failed:', err);
      console.error('❌ [AuthContext] Error message:', err.message);
      console.error('❌ [AuthContext] Error response:', err.response);
      throw err;
    }
  }

  const logout = () => {
    apiClearToken();
    setUser(null);
  };

  const value: Context = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    logout,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};