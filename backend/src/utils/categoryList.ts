import fs from "fs/promises";
import * as path from "path";
import { fetchAll } from "../db";

// categories.jsonファイルを作る処理
export async function createCategories() {
  const sql = `
    SELECT
      a.CATEGORY_ID AS id,
      b.NAME AS name,
      COUNT(*) AS count
    FROM
      POSTS a
    JOIN CATEGORIES b
      ON a.CATEGORY_ID = b.ID
    WHERE
      a.STATUS = 'released'
    GROUP BY
      a.CATEGORY_ID, b.NAME
    ORDER BY
      a.CATEGORY_ID
  `;
  const rows = await fetchAll(sql);

  // json形式にパース
  const jsonData = JSON.stringify(rows, null, 2);

  // 保存先パス
  const filePath = path.join(__dirname, "../../data/categories.json");
  console.log(filePath);

  try {
    await fs.writeFile(filePath, jsonData, "utf-8");
    console.log("✅ categories.json を出力しました");
  } catch (err) {
    console.error("❌ categories.json の出力に失敗しました", err);
  }
}
