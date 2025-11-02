import express from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { readFile } from "fs/promises";
import path from "path";
import { execute, fetchAll } from "../db";

const router = express.Router();

// アクセス制限: IP単位で60秒に1回だけログ記録
let skipLogging = false;
const accessLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  keyGenerator: (req) => ipKeyGenerator(req.ip || ""),
  handler: (req, res, next) => {
    skipLogging = true;
    next();
  },
  skip: (req) => {
    const ua = req.headers["user-agent"] || "";
    return /bot|crawler|spider|slurp|curl|wget/i.test(ua);
  },
});

router.get(
  "/:id",
  accessLimiter,
  async (req: express.Request, res: express.Response) => {
    const id = req.params.id.trim();
    const filePath = path.resolve(`/app/posts/${id}`, `${id}.md`);
    const sql = `
    SELECT
      a.TITLE,
      b.NAME AS CATEGORY_NAME,
      c.TAGS_NAME,
      STRFTIME('%Y/%m/%d', a.UPDATE_DATE) AS UPDATE_DATE
    FROM (
      SELECT * FROM POSTS WHERE ID = ? AND STATUS = 'released'
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

    try {
      const postMetaData = await fetchAll(sql, [id]);

      if (!postMetaData || postMetaData.length === 0) {
        return res.status(404).json({ error: "記事が見つかりません（DB）" });
      }

      const content = await readFile(filePath, "utf8");

      const post = postMetaData[0];

      // 問題なく取得できたら、アクセスログを記録する
      const ipAddress = req.ip;
      const userAgent = req.headers["user-agent"] || "";

      const accessSql = `
        INSERT INTO ACCESS_LOGS_DAILY (
          POST_ID, USER_AGENT, IP_ADDRESS
        ) VALUES (
          ?, ?, ?
        )
      `;
      await execute(accessSql, [id, userAgent, ipAddress]);

      return res.json({
        title: post.TITLE,
        category: post.CATEGORY_NAME,
        tags: post.TAGS_NAME ? post.TAGS_NAME.split(",") : [],
        updateDate: post.UPDATE_DATE,
        content,
      });
    } catch (err) {
      console.error("記事取得エラー:", err);
      if (err instanceof Error && "code" in err && err.code === "ENOENT") {
        return res
          .status(404)
          .json({ error: "記事ファイルが見つかりません。" });
      }
      return res.status(500).json({ error: "記事の取得に失敗しました。" });
    }
  }
);

export default router;
