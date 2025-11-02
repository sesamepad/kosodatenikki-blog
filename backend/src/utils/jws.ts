import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { fetchOne } from "../db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const EXPIRES_IN = "4h";

export function generateJwt(
  payload: object,
  options?: jwt.SignOptions
): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN, ...options });
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "トークンがありません" });
  }

  const token = authHeader.split(" ")[1];

  // ブラックリストチェック
  const revoked = await fetchOne(
    "SELECT 1 FROM REVOKED_TOKENS WHERE TOKEN = ?",
    [token]
  );
  if (revoked) {
    return res.status(401).json({ message: "このトークンは失効しています" });
  }

  try {
    jwt.verify(token, JWT_SECRET); // 検証
    next();
  } catch (err) {
    return res.status(403).json({ message: "無効なトークンです" });
  }
};
