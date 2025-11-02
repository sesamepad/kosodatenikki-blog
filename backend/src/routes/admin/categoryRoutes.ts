import express from "express";
import { execute, fetchAll } from "../../db";
import { verifyToken } from "../../middleware/authMiddleware";
import { createCategories } from "../../utils/categoryList";

const router = express.Router();

// カテゴリ一覧取得
router.get("/", verifyToken, async (req, res) => {
  try {
    const rows = await fetchAll("SELECT ID, NAME, NAME_EN FROM CATEGORIES");
    res.json(rows);
  } catch (error) {
    console.error("カテゴリ取得エラー:", error);
    return res.status(500).json({ error: "カテゴリ取得に失敗しました" });
  }
});

// 新規カテゴリ追加
router.post("/", verifyToken, async (req, res) => {
  const { name, name_en } = req.body;

  if (!name || !name_en) {
    return res.status(400).json({ error: "name と name_en は必須です" });
  }

  try {
    const sql = "INSERT INTO CATEGORIES (NAME, NAME_EN) VALUES (?, ?)";
    await execute(sql, [name, name_en]);

    // categories.jsonを作成する処理
    await createCategories();

    res.status(201).json({ message: "カテゴリ追加成功" });
  } catch (error) {
    console.error("カテゴリ追加エラー:", error);
    res.status(500).json({ error: "カテゴリ追加に失敗しました" });
  }
});

// カテゴリ更新
router.put("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, name_en } = req.body;

  if (!name || !name_en) {
    return res.status(400).json({ message: "nameとname_enは必須です" });
  }

  try {
    const sql = "UPDATE CATEGORIES SET NAME = ?, NAME_EN = ? WHERE ID = ?";
    await execute(sql, [name, name_en, id]);

    // categories.jsonを作成する処理
    await createCategories();

    res.json({ message: "カテゴリを更新しました" });
  } catch (error) {
    console.error("カテゴリ更新エラー:", error);
    res.status(500).json({ message: "カテゴリの更新に失敗しました" });
  }
});

// カテゴリ削除
router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const sql = "DELETE FROM CATEGORIES WHERE ID = ?";
    await execute(sql, [id]);

    // categories.jsonを作成する処理
    await createCategories();

    res.json({ message: "カテゴリを削除しました" });
  } catch (error) {
    console.error("カテゴリ削除エラー:", error);
    res.status(500).json({ message: "カテゴリの削除に失敗しました" });
  }
});

export default router;
