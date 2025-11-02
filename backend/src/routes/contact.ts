import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  // リクエストボディから氏名、メール、本文を取得する
  const { name, email, message } = req.body;

  // いずれかが空の場合は、エラーを返す。
  if (!name || !email || !message) {
    return res.status(400).json({ error: "必須項目が未入力です" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // 自分宛てにメール送信を行う
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: `ブログお問い合わせ: ${name}`,
      text: `
氏名: ${name}
メールアドレス: ${email}
---
${message}
      `,
    });

    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "メール送信に失敗しました" });
  }
});

export default router;
