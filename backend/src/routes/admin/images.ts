import express from "express";
import fs from "fs/promises";
import multer from "multer";
import path from "path";
import sharp from "sharp";
import { verifyToken } from "../../middleware/authMiddleware";

const router = express.Router();

// メモリ上に一時保存
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

// 画像追加（cover.jpg 以外）
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { postId } = req.body;
    const file = req.file;

    if (!file || !postId) {
      return res
        .status(400)
        .json({ message: "ファイルまたは postId が不足しています" });
    }

    const dirPath = path.resolve(__dirname, `../../../posts/${postId}`);
    await fs.mkdir(dirPath, { recursive: true });

    const fileName = file.originalname;
    const filePath = path.join(dirPath, fileName);

    await sharp(file.buffer).jpeg({ quality: 90 }).toFile(filePath);

    return res.status(200).json({
      message: "画像を保存しました",
      name: fileName,
      url: `images/${postId}/${fileName}`,
    });
  } catch (error) {
    console.error("画像アップロードエラー:", error);
    return res
      .status(500)
      .json({ message: "画像の保存中にエラーが発生しました" });
  }
});

// 画像一覧取得（cover.jpg を除外）
router.get("/", verifyToken, async (req, res) => {
  const postId = req.query.postId as string;

  if (!postId) {
    return res.status(400).json({ message: "postId が指定されていません" });
  }

  const dirPath = path.resolve(__dirname, `../../../posts/${postId}`);

  try {
    const files = await fs.readdir(dirPath);

    // cover.jpg を除き、画像ファイルのみ抽出
    const imageFiles = files.filter(
      (file) =>
        file.toLowerCase() !== "cover.jpg" &&
        /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );

    const images = imageFiles.map((fileName) => ({
      name: fileName,
      url: `images/${postId}/${fileName}`,
    }));

    return res.status(200).json(images);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return res.status(200).json([]);
    }
    console.error("画像一覧取得エラー:", error);
    return res
      .status(500)
      .json({ message: "画像一覧取得中にエラーが発生しました" });
  }
});

// 画像削除（cover.jpg 以外）
router.delete("/", verifyToken, async (req, res) => {
  const { postId, name } = req.query;

  if (!postId || !name) {
    return res
      .status(400)
      .json({ message: "postIdまたはnameが指定されていません" });
  }

  if ((name as string).toLowerCase() === "cover.jpg") {
    return res.status(400).json({ message: "cover.jpg は削除できません" });
  }

  const filePath = path.resolve(__dirname, `../../../posts/${postId}/${name}`);

  try {
    await fs.unlink(filePath);
    return res.status(200).json({ message: "画像を削除しました" });
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return res.status(404).json({ message: "画像ファイルが存在しません" });
    }
    console.error("削除中のエラー:", error);
    return res
      .status(500)
      .json({ message: "画像削除中にエラーが発生しました" });
  }
});

export default router;
