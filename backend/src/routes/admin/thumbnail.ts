import express from "express";
import fs from "fs/promises";
import multer from "multer";
import path from "path";
import sharp from "sharp";
import { verifyToken } from "../../middleware/authMiddleware";

const router = express.Router();

// multer一時保存先（メモリに保存）
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 最大5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("画像ファイルのみアップロード可能です"));
    }
  },
});

// 新規画像追加
router.post("/", verifyToken, upload.single("thumbnail"), async (req, res) => {
  try {
    const { postId } = req.body;
    const file = req.file;

    if (!file || !postId) {
      return res
        .status(400)
        .json({ message: "ファイルまたはpostIdが不足しています" });
    }

    const outputDir = path.resolve(__dirname, `../../../posts/${postId}`);
    const outputPath = path.join(outputDir, "cover.jpg");

    // ディレクトリ作成（なければ）
    await fs.mkdir(outputDir, { recursive: true });

    // Sharpで画像をJPGに変換して保存
    await sharp(file.buffer).jpeg({ quality: 90 }).toFile(outputPath);

    return res
      .status(200)
      .json({ message: "画像を保存しました", path: outputPath });
  } catch (error) {
    console.error("サムネイルアップロードエラー:", error);
    return res
      .status(500)
      .json({ message: "画像の保存中にエラーが発生しました" });
  }
});

// 画像削除
router.delete("/", verifyToken, async (req, res) => {
  const postId = req.query.id as string;

  if (!postId) {
    return res.status(400).json({ message: "id が指定されていません" });
  }

  const imagePath = path.resolve(
    __dirname,
    `../../../posts/${postId}/cover.jpg`
  );

  try {
    await fs.unlink(imagePath);
    return res.status(200).json({ message: "画像を削除しました" });
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return res.status(404).json({ message: "画像ファイルが存在しません" });
    }
    console.error("削除中のエラー:", error);
    return res
      .status(500)
      .json({ message: "画像の削除中にエラーが発生しました" });
  }
});

export default router;
