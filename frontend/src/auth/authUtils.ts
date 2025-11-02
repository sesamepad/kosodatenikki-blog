import type { JwtPayload } from "@/types/auth";

export const verifyToken = (token: string): boolean => {
  try {
    const base64Payload = token.split(".")[1];
    if (!base64Payload) return false;

    const payload: JwtPayload = JSON.parse(atob(base64Payload));
    const now = Math.floor(Date.now() / 1000);
    return typeof payload.exp === "number" && payload.exp > now;
  } catch {
    return false;
  }
};
