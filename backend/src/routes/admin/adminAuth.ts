import bcrypt from "bcrypt";
import express from "express";
import { fetchOne } from "../../db";
import { generateJwt } from "../../utils/jws";

const router = express.Router();

router.post("/", async (req, res) => {
  // パラメータからusernameとpasswordをセット
  const { username, password } = req.body;

  // 管理者情報をSQLで取得
  try {
    const sql = "SELECT * FROM ADMIN_USERS WHERE USERNAME = ?";
    const user = await fetchOne(sql, username);

    // 管理者情報が取得できない場合は、401を返す
    if (!user) {
      return res.status(401).json({ message: "ユーザーが見つかりません" });
    }

    // bcryptでハッシュ化されたパスと入力されたデータを比較する
    const valid: boolean = await bcrypt.compare(password, user.PASSWORD_HASH);
    if (!valid) {
      return res.status(401).json({ message: "パスワードが間違っています" });
    }

    // JSON Web Tokenの発行
    const token = generateJwt({ id: user.ID, username: user.USERNAME });
    res.json({ token });
  } catch (err) {
    console.error("ログインエラー:", err);
    res.status(500).json({ message: "ログイン中にエラーが発生しました" });
  }
});

export default router;
