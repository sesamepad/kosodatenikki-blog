import { fetchAll } from "../db";
import fs from "fs/promises";
import * as path from "path";

// 共通関数：ランキング取得
async function getRanking(period: "daily" | "weekly" | "monthly") {
  let dateCondition = "";
  if (period === "daily") {
    dateCondition = `a.ACCESS_DATE = STRFTIME('%Y-%m-%d', DATE('now', '-1 day'))`;
  } else if (period === "weekly") {
    dateCondition = `a.ACCESS_DATE >= STRFTIME('%Y-%m-%d', DATE('now', '-7 day'))`;
  } else {
    dateCondition = `a.ACCESS_DATE >= STRFTIME('%Y-%m-%d', DATE('now', '-30 day'))`;
  }

  const sql = `
    SELECT
      a.POST_ID AS ID,
      b.TITLE,
      c.NAME AS CATEGORY_NAME
    FROM
      ACCESS_TOTALS a
    JOIN POSTS b
      ON a.POST_ID = b.ID
    JOIN CATEGORIES c
      ON b.CATEGORY_ID = c.ID
    WHERE
      ${dateCondition}
    GROUP BY
      a.POST_ID, b.TITLE, c.NAME
    ORDER BY
      SUM(a.ACCESS_COUNT) DESC
    LIMIT
      10
  `;

  let rows = await fetchAll(sql);

  // 10件以下だった場合、最新のID降順で補填する
  if (rows.length < 10) {
    const limit = 10 - rows.length;
    const addSql = `
      SELECT
        a.ID,
        a.TITLE,
        b.NAME AS CATEGORY_NAME
      FROM
        POSTS a
      JOIN CATEGORIES b
        ON a.CATEGORY_ID = b.ID
      ORDER BY
        a.ID DESC
      LIMIT ?
    `;
    const addRows = await fetchAll(addSql, [limit]);

    rows = rows.concat(addRows);
  }

  // 取得した結果を展開
  return rows.map((row, index) => ({
    rank: index + 1,
    id: String(row.ID),
    title: row.TITLE,
    category_name: row.CATEGORY_NAME,
  }));
}

// メイン処理
(async () => {
  try {
    const result = {
      daily: await getRanking("daily"),
      weekly: await getRanking("weekly"),
      monthly: await getRanking("monthly"),
    };

    const outputPath = path.join(__dirname, "../data/popular_posts.json");
    await fs.writeFile(outputPath, JSON.stringify(result, null, 2), "utf-8");

    console.log("✅ popular_posts.json を出力しました");
  } catch (error) {
    console.error("❌ popular_posts.json の出力に失敗しました:", error);
  }
})();
