import React from "react";

export type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
};

export type JwtPayload = {
  exp?: number;
  [key: string]: any;
};

export type ProtectedRouteProps = {
  children: React.ReactNode;
};
