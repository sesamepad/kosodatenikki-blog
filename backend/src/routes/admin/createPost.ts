import express from "express";
import fs from "fs/promises";
import path from "path";
import { fetchOne } from "../../db";
import { verifyToken } from "../../middleware/authMiddleware";
import { createTags } from "../../utils/tagList";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    // 現在のpostsの最大のIDを取得する
    const maxId = await fetchOne(`SELECT MAX(ID) + 1 AS ID FROM POSTS`);

    // IDのディレクトリを作成する ※ 一度全削除してから再作成
    const dirPath = path.join(__dirname, "../../../posts", String(maxId.ID));
    await fs.rm(dirPath, { recursive: true, force: true });
    await fs.mkdir(dirPath, { recursive: true });

    // tags.jsonを作成する処理
    await createTags();

    res.status(200).json({ id: maxId.ID });
  } catch (error) {
    console.error("新しいIDの取得失敗しました", error);
    res.status(500).json({ error: "新しいID取得失敗" });
  }
});

export default router;
