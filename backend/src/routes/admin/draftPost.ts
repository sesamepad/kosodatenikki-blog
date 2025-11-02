import express from "express";
import * as fsSync from "fs";
import * as fs from "fs/promises";
import path from "path";
import removeMarkdown from "remove-markdown";
import { execute, fetchOne } from "../../db";
import { verifyToken } from "../../middleware/authMiddleware";
import { createTags } from "../../utils/tagList";

const router = express.Router();

function truncateStringToBytes(str: string, maxBytes: number): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);

  if (bytes.length <= maxBytes) {
    return str;
  }
  // 50バイト以内に収まるようにバイト配列を切り詰める
  const truncatedBytes = bytes.slice(0, maxBytes);

  // バイト配列を文字列にデコードし直す
  const decoder = new TextDecoder("utf-8", { fatal: false });
  let result = decoder.decode(truncatedBytes);

  // もし末尾が文字の途中だった場合、（U+FFFD）になるため、それを削除する
  if (result.endsWith("")) {
    result = decoder.decode(truncatedBytes.slice(0, -1));
  }

  return result;
}

router.get("/:id/edit", verifyToken, async (req, res) => {
  const postId = req.params.id;

  try {
    const sql = `
      SELECT
        a.ID AS ID,
        a.TITLE AS TITLE,
        a.CATEGORY_ID AS CATEGORY_ID,
        GROUP_CONCAT(b.TAG_ID, ',') AS TAG_IDS,
        STRFTIME('%Y/%m/%d', a.UPDATE_DATE) AS UPDATE_DATE
      FROM (
        SELECT * FROM POSTS WHERE ID = ? 
      ) a
      LEFT JOIN POST_TAGS b
        ON a.ID = b.POST_ID
    `;
    const post = await fetchOne(sql, [postId]);

    if (!post) return res.status(404).json({ error: "記事が見つかりません" });

    // tag_idsを配列に変換
    const tagIds = post.TAG_IDS
      ? post.TAG_IDS.split(",").map((tag_id: string) => Number(tag_id))
      : [];

    // markdown読み込み
    const baseDir = path.join(__dirname, `../../../posts/${postId}`);
    const markdownPath = path.join(baseDir, `${postId}.md`);
    const markdown = fsSync.existsSync(markdownPath)
      ? fsSync.readFileSync(markdownPath, "utf8")
      : "";

    // 画像取得
    const getImageFilenames = (baseDir: string): string[] => {
      if (!fsSync.existsSync(baseDir)) {
        return [];
      }
      // 取得対象の拡張子
      const allowedExtensions = [".png", ".jpg", ".jpeg"];
      // baseDirの中のファイルを配列取得
      const files = fsSync.readdirSync(baseDir);

      const imageFiles = files.filter((file) => {
        // 拡張子取得
        const ext = path.extname(file).toLowerCase();
        // 拡張子を除いたファイル名取得
        const name = path.basename(file, ext).toLowerCase();

        // 指定の拡張子&ファイル名がcover以外でフィルタリング
        return allowedExtensions.includes(ext) && name !== "cover";
      });

      return imageFiles;
    };

    const imageList = getImageFilenames(baseDir);

    res.json({
      id: post.ID,
      title: post.TITLE,
      category_id: post.CATEGORY_ID,
      tag_ids: tagIds,
      markdown: markdown,
      image_paths: imageList,
      update_date: post.UPDATE_DATE,
    });
  } catch (err) {
    console.error("記事取得エラー:", err);
    res.status(500).json({ error: "記事取得に失敗しました" });
  }
});

router.post("/", verifyToken, async (req, res) => {
  const { process_type, id, title, main_text, category, tags } = req.body;

  // postsテーブルを追加・更新する
  try {
    // SLUGを取得するためにカテゴリ名を取得する
    const category_name = await fetchOne(
      `SELECT NAME_EN FROM CATEGORIES WHERE ID = ?`,
      [category]
    );
    const status = process_type === "publish" ? "released" : "draft";
    const abridgement_main = truncateStringToBytes(
      removeMarkdown(main_text),
      50
    );
    const sql = `
      INSERT INTO POSTS(
        ID, CATEGORY_ID, TITLE, 
        SLUG, MAIN_TEXT, STATUS,
        CREATE_DATE, UPDATE_DATE
      ) VALUES (
        ?, ?, ?, 
        ?, ?, ?,
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
      ON CONFLICT(ID) DO UPDATE SET
        CATEGORY_ID = ?,
        TITLE = ?,
        SLUG = ?,
        MAIN_TEXT = ?,
        STATUS = ?,
        UPDATE_DATE = CURRENT_TIMESTAMP
    `;
    await execute(sql, [
      id,
      category,
      title,
      `${category_name.NAME_EN}/${id}`,
      abridgement_main,
      status,
      category,
      title,
      `${category_name.NAME_EN}/${id}`,
      abridgement_main,
      status,
    ]);

    // タグは削除して入れ直す
    await execute(`DELETE FROM POST_TAGS WHERE POST_ID= ?`, [id]);
    for (const tag of tags) {
      const update_sql = `
        INSERT INTO POST_TAGS (
          POST_ID, TAG_ID
        ) VALUES (
          ?, ?
        ) ON CONFLICT(POST_ID, TAG_ID) DO NOTHING
      `;
      await execute(update_sql, [id, tag]);
    }

    // マークダウンの上書きを行う
    const markdown_path = path.join(__dirname, `../../../posts/${id}/${id}.md`);
    await fs.mkdir(path.dirname(markdown_path), { recursive: true });
    await fs.writeFile(markdown_path, main_text, "utf-8");

    // tags.jsonを作成する処理
    if (status == "released") {
      await createTags();
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "記事の保存に失敗しました" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  const id = req.params.id;

  try {
    // POST_TAGSテーブルから削除
    await execute(`DELETE FROM POST_TAGS WHERE POST_ID = ?`, [id]);
    // POSTテーブルから削除
    await execute(`DELETE FROM POSTS WHERE ID = ?`, [id]);
    // ディレクトリごと抹消
    const dirPath = path.join(__dirname, "../../../posts", id);
    await fs.rm(dirPath, { recursive: true, force: true });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "記事の削除に失敗しました" });
  }
});

export default router;
