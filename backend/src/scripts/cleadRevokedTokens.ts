import { execute } from "../db";

(async () => {
  const sql = `
    DELETE FROM
      REVOKED_TOKENS
    WHERE
      REVOKED_AT <= DATE('now', '-30 day')
  `;

  try {
    await execute(sql, []);
    console.log("✅ 使用済みトークンの掃除が完了");
  } catch (error) {
    console.error("❌ 使用済みトークンの掃除に失敗:", error);
  }
})();
