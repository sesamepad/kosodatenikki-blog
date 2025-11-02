import { AuthContext } from "@/auth/AuthContext";
import { verifyToken } from "@/auth/authUtils";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const valid = token && verifyToken(token);

    if (valid) {
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("admin_token");
      setIsAuthenticated(false);
    }

    setLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem("admin_token", token);
    setIsAuthenticated(true);
    navigate("/admin/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setIsAuthenticated(false);
    navigate("/admin/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
