import express from "express";
import { fetchAll, fetchOne } from "../db";

const router = express.Router();

router.get("/", async (req: express.Request, res: express.Response) => {
  const tag = req.query.tag as string | undefined;
  const category = req.query.category as string | undefined;
  const page = parseInt(req.query.page as string) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  try {
    let sql = `
      SELECT
        a.ID,
        a.TITLE,
        a.SLUG,
        b.NAME AS CATEGORY_NAME,
        c.TAGS_NAME,
        a.MAIN_TEXT,
        STRFTIME('%Y/%m/%d', a.CREATE_DATE) AS CREATE_DATE
      FROM (
        SELECT
          *
        FROM
          POSTS
        WHERE
          STATUS = 'released'
      ) a
      LEFT JOIN CATEGORIES b 
        ON a.CATEGORY_ID = b.ID
      LEFT JOIN (
        SELECT
          d.POST_ID,
          GROUP_CONCAT(e.NAME, ',') AS TAGS_NAME
        FROM 
          POST_TAGS d
        LEFT JOIN TAGS e 
          ON d.TAG_ID = e.ID
        GROUP BY 
          d.POST_ID
      ) c 
        ON a.ID = c.POST_ID
    `;

    const params: any[] = [];

    if (tag) {
      // タグ絞り込み用のJOINを追加して、特定タグの記事のみ取得
      sql += `
        INNER JOIN POST_TAGS pt 
          ON a.ID = pt.POST_ID
        INNER JOIN TAGS t 
          ON pt.TAG_ID = t.ID
            AND t.NAME = ?
      `;
      params.push(tag.trim());
    }

    if (category) {
      sql += `
        WHERE
          b.NAME = ?
      `;
      params.push(category.trim());
    }

    sql += `
      ORDER BY 
        a.CREATE_DATE DESC
      LIMIT ? 
      OFFSET ?
    `;
    params.push(limit, offset);

    const posts = await fetchAll(sql, params);

    // 総記事数を取得
    let countSql = `
      SELECT 
        COUNT(*) AS COUNTA 
      FROM 
        POSTS a
    `;
    if (tag) {
      countSql += `
        INNER JOIN POST_TAGS pt 
          ON a.ID = pt.POST_ID
        INNER JOIN TAGS t 
          ON pt.TAG_ID = t.ID
            AND t.NAME = ?
      `;
      params.push(tag.trim());
    }
    if (category) {
      countSql += `
        INNER JOIN CATEGORIES cate
          ON a.CATEGORY_ID = cate.ID
            AND cate.NAME = ?
      `;
      params.push(category.trim());
    }

    const countParams: any[] = [];
    const countResult = await fetchOne(countSql, countParams);
    const totalPosts = countResult.COUNTA;
    const totalPages = Math.ceil(totalPosts / limit);

    res.json({ posts, totalPages });
  } catch (err) {
    console.error("DB SELECT error:", err);
    res.status(500).json({ error: "データの取得に失敗しました。" });
  }
});

export default router;
