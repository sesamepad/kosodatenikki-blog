import express from "express";
import { fetchAll } from "../db";

const router = express.Router();

router.get("/", async (req: express.Request, res: express.Response) => {
  const id = req.query.id as string | undefined;
  const params: any[] = [];

  try {
    const postId = id?.trim();
    let sql = `
      SELECT
        a.ID AS id,
        a.TITLE AS title,
        a.MAIN_TEXT AS main_text,
        c.NAME AS category_name
      FROM (
        SELECT
          ID, CATEGORY_ID, TITLE, UPDATE_DATE, MAIN_TEXT
        FROM
          POSTS
        WHERE
          ID != ?
          AND STATUS = 'released'
          AND CATEGORY_ID = (SELECT CATEGORY_ID FROM POSTS WHERE ID = ?)
      ) a
      LEFT JOIN (
        SELECT
          POST_ID,
          SUM(ACCESS_COUNT) AS TOTAL
        FROM
          ACCESS_TOTALS
        WHERE
          DATE(ACCESS_DATE) >= DATE('now', '-7 days')
          AND POST_ID != ?
      ) b
        ON a.ID = b.POST_ID
      JOIN CATEGORIES c
        ON a.CATEGORY_ID = c.ID
      ORDER BY
        IFNULL(b.TOTAL, 0) ASC,
        a.UPDATE_DATE DESC
      LIMIT 4
    `;
    params.push(...[postId, postId, postId]);
    const relationPosts = await fetchAll(sql, params);
    res.json(relationPosts);
  } catch (error) {
    console.error("DB SELECT error:", error);
    res.status(500).json({ error: "関連記事のデータ取得に失敗しました" });
  }
});

export default router;
