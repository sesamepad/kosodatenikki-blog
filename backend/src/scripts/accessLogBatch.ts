import { execute } from "../db";

// 前日の日付（YYYY-MM-DD形式）
const yesterday = new Date(Date.now() - 86400000);
const dateStr = yesterday.toISOString().split("T")[0];

(async () => {
  const sql = `
    INSERT INTO ACCESS_TOTALS (
      POST_ID, ACCESS_DATE, ACCESS_COUNT
    )
    SELECT
      POST_ID,
      ? AS ACCESS_DATE,
      COUNT(DISTINCT IP_ADDRESS) AS ACCESS_COUNT
    FROM
      ACCESS_LOGS_DAILY
    GROUP BY
      POST_ID
  `;

  try {
    await execute(sql, [dateStr]);
    console.log(`✅ ${dateStr} のアクセス集計が完了しました`);

    // 集計が完了したら、デイリーのアクセスを削除する
    await execute("DELETE FROM ACCESS_LOGS_DAILY");

    // 集計テーブルは、1か月分のみ残す
    const organizeSql = `
      DELETE FROM
        ACCESS_TOTALS
      WHERE
        ACCESS_DATE <= STRFTIME('%Y-%m-%d', DATE('now', '-30 day'))
    `;
    await execute(organizeSql);
  } catch (error) {
    console.error("❌ 集計バッチ失敗:", error);
  }
})();
