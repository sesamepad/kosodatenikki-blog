import express from "express";
import fs from "fs/promises";
import path from "path";
import { execute, fetchAll } from "../../db";
import { verifyToken } from "../../middleware/authMiddleware";

const router = express.Router();

// 下書き記事一覧取得API
router.get("/", verifyToken, async (req, res) => {
  try {
    const sql = `
      SELECT 
        ID, 
        TITLE,
        STRFTIME('%Y/%m/%d', UPDATE_DATE) AS UPDATE_DATE
      FROM 
        POSTS
      WHERE
        STATUS = 'draft' 
      ORDER BY 
        UPDATE_DATE DESC
    `;
    const rows = await fetchAll(sql);
    res.json(rows);
  } catch (error) {
    console.error("下書き記事取得エラー:", error);
    res.status(500).json({ error: "下書き記事の取得に失敗しました" });
  }
});

// 下書き記事削除API
router.delete("/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  try {
    // DB(POST_TAGS)から削除
    const postTagsSql = `DELETE FROM POST_TAGS WHERE POST_ID = ?`;
    await execute(postTagsSql, [id]);

    // DB(POSTS)から削除
    const PostSql = `DELETE FROM POSTS WHERE ID = ?`;
    await execute(PostSql, [id]);
    res.json({ message: "削除成功" });

    // ファイルシステムの削除処理
    const backendPath = path.join(__dirname, `../../../posts/${id}/${id}.md`);
    const deleteDir = async (dirPath: string) => {
      try {
        await fs.rm(dirPath, { recursive: true, force: true });
        console.log(`ファイル削除成功: ${dirPath}`);
      } catch (err) {
        console.warn(`ファイル削除失敗: ${dirPath}`, err);
      }
    };
    deleteDir(backendPath);

    res.json({ message: "削除成功" });
  } catch (error) {
    console.error("削除エラー:", error);
    res.status(500).json({ error: "削除に失敗しました" });
  }
});

export default router;
