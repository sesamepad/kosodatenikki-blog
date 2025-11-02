import fs from "fs/promises";
import * as path from "path";
import { fetchAll } from "../db";

// tags.jsonファイルを作る処理
export async function createTags() {
  const sql = `
    SELECT
      b.ID AS id,
      b.NAME AS name,
      COUNT(*) AS count
    FROM
      POST_TAGS a
    JOIN TAGS b
      ON a.TAG_ID = b.ID
    JOIN POSTS c
      ON a.POST_ID = c.ID
    WHERE
      c.STATUS = 'released'
    GROUP BY
      b.ID, b.NAME
    ORDER BY
      b.NAME
  `;
  const rows = await fetchAll(sql);

  // json形式にパース
  const jsonData = JSON.stringify(rows, null, 2);

  // 保存先パス
  const filePath = path.join(__dirname, "../../data/tags.json");
  console.log(filePath);

  try {
    await fs.writeFile(filePath, jsonData, "utf-8");
    console.log("✅ tag.json を出力しました");
  } catch (err) {
    console.error("❌ tag.json の出力に失敗しました", err);
  }
}
