import express from "express";
import { execute, fetchAll, fetchOne } from "../../db";
import { verifyToken } from "../../middleware/authMiddleware";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string);
  const offset = (page - 1) * limit;
  try {
    // 記事一覧を取得する
    const sql = `
        SELECT
          a.ID,
          b.NAME AS CATEGORY,
          a.TITLE,
          STRFTIME('%Y/%m/%d', a.CREATE_DATE) AS CREATE_DATE,
          STRFTIME('%Y/%m/%d', a.UPDATE_DATE) AS UPDATE_DATE,
          CASE a.STATUS
            WHEN 'released' THEN TRUE
            ELSE FALSE
          END AS STATUS
        FROM 
          POSTS a
        LEFT JOIN CATEGORIES b
          ON a.CATEGORY_ID = b.ID
        ORDER BY
          a.UPDATE_DATE DESC
        LIMIT
          ?
        OFFSET
          ?
      `;
    const posts = await fetchAll(sql, [limit, offset]);

    // 総記事数を取得
    const countResult = await fetchOne(`SELECT COUNT(*) AS COUNTA FROM POSTS`);
    const totalPages = Math.ceil(countResult.COUNTA / limit);

    res.status(200).json({ posts: posts, totalPages: totalPages });
  } catch (error) {
    res.status(500).json({ error: "記事の取得に失敗しました" });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  const { isPublished } = req.body;

  if (typeof isPublished !== "boolean") {
    return res.status(400).json({ error: "Boolean型以外が渡されました" });
  }

  try {
    const status = isPublished ? "released" : "draft";
    const sql = `
      UPDATE
        POSTS
      SET
        STATUS = ?,
        UPDATE_DATE = CURRENT_TIMESTAMP
      WHERE
        ID = ?
    `;

    await execute(sql, [status, id]);

    res.status(200).json({ message: "更新性向", id, status });
  } catch (error) {
    res.status(500).json({ error: "ステータス更新失敗" });
  }
});

export default router;
