import { Navigate } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import type { ProtectedRouteProps } from "@/types/auth";

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
};
