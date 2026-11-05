import React, { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../api/auth";
import { getToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (token) {
        try {
          const me = await authApi.getMe();
          setUser(me);
        } catch (e) {
          // token expired or invalid
          setUser(null);
        }
      }
      setLoading(false);
    })();
  }, []);

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    setUser(data);
    return data;
  };

  const register = async (payload) => {
    const data = await authApi.register(payload);
    setUser(data);
    return data;
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
