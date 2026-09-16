import React, { createContext, useContext, useState, useEffect } from "react";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("obi_token"));
  const [role, setRole] = useState(() => localStorage.getItem("obi_role"));
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("obi_user") || "null"); }
    catch { return null; }
  });

  useEffect(() => {
    if (token) localStorage.setItem("obi_token", token);
    else localStorage.removeItem("obi_token");
    if (role) localStorage.setItem("obi_role", role);
    else localStorage.removeItem("obi_role");
    if (user) localStorage.setItem("obi_user", JSON.stringify(user));
    else localStorage.removeItem("obi_user");
  }, [token, role, user]);

  const login = (newToken, newRole, newUser) => {
    setToken(newToken);
    setRole(newRole);
    setUser(newUser);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ token, role, user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
