import express from "express";
import { execute } from "../../db";
import { verifyToken } from "../../middleware/authMiddleware";

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  await execute("INSERT INTO REVOKED_TOKENS (TOKEN) VALUES (?)", [token]);

  res.sendStatus(200);
});

export default router;
