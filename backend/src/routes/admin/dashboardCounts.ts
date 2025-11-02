import express from "express";
import { fetchOne } from "../../db";
import { verifyToken } from "../../middleware/authMiddleware";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    // TODO: 将来は STATUS='draft' などで分ける
    const drafts = await fetchOne(
      "SELECT COUNT(*) AS COUNTA FROM POSTS WHERE STATUS ='draft'"
    );
    const posts = await fetchOne(
      "SELECT COUNT(*) AS COUNTA FROM POSTS WHERE STATUS != 'draft'"
    );
    const categories = await fetchOne(
      "SELECT COUNT(*) AS COUNTA FROM CATEGORIES"
    );
    const tags = await fetchOne("SELECT COUNT(*) AS COUNTA FROM TAGS");

    res.json({
      drafts: drafts.COUNTA,
      posts: posts.COUNTA,
      categories: categories.COUNTA,
      tags: tags.COUNTA,
    });
  } catch (error) {
    console.error("件数取得エラー:", error);
    res.status(500).json({ message: "件数取得に失敗しました" });
  }
});

export default router;
