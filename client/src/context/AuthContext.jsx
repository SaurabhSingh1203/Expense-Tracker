import { createContext, useContext, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("finance-token"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("finance-user");
    return saved ? JSON.parse(saved) : null;
  });

  async function login(formData) {
    const { data } = await api.post("/auth/login", formData);
    saveSession(data);
  }

  async function signup(formData) {
    const { data } = await api.post("/auth/signup", formData);
    saveSession(data);
  }

  function saveSession(data) {
    localStorage.setItem("finance-token", data.token);
    localStorage.setItem("finance-user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("finance-token");
    localStorage.removeItem("finance-user");
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({ token, user, isAuthenticated: Boolean(token), login, signup, logout }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
