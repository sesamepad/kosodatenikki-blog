import express from "express";
import { execute, fetchAll } from "../../db";
import { verifyToken } from "../../middleware/authMiddleware";
import { createTags } from "../../utils/tagList";

const router = express.Router();

// タグ一覧取得
router.get("/", verifyToken, async (req, res) => {
  try {
    const rows = await fetchAll("SELECT ID, NAME, NAME_EN FROM TAGS");
    res.json(rows);
  } catch (error) {
    console.error("タグ取得エラー:", error);
    return res.status(500).json({ error: "タグ取得に失敗しました" });
  }
});

// 新規タグ追加
router.post("/", verifyToken, async (req, res) => {
  const { name, name_en } = req.body;

  if (!name || !name_en) {
    return res.status(400).json({ error: "name と name_en は必須です" });
  }

  try {
    const sql = "INSERT INTO TAGS (NAME, NAME_EN) VALUES (?, ?)";
    await execute(sql, [name, name_en]);

    // tags.jsonを作成する処理
    await createTags();

    res.status(201).json({ message: "タグ追加成功" });
  } catch (error) {
    console.error("タグ追加エラー:", error);
    res.status(500).json({ error: "タグ追加に失敗しました" });
  }
});

// タグ更新
router.put("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, name_en } = req.body;

  if (!name || !name_en) {
    return res.status(400).json({ message: "nameとname_enは必須です" });
  }

  try {
    const sql = "UPDATE TAGS SET NAME = ?, NAME_EN = ? WHERE ID = ?";
    await execute(sql, [name, name_en, id]);
    res.json({ message: "タグを更新しました" });
  } catch (error) {
    console.error("タグ更新エラー:", error);
    res.status(500).json({ message: "タグの更新に失敗しました" });
  }
});

// タグ削除
router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const sql = "DELETE FROM TAGS WHERE ID = ?";
    await execute(sql, [id]);
    res.json({ message: "タグを削除しました" });
  } catch (error) {
    console.error("タグ削除エラー:", error);
    res.status(500).json({ message: "タグの削除に失敗しました" });
  }
});

export default router;
