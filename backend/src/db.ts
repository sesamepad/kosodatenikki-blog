import { Database, open } from "sqlite";
import sqlite3 from "sqlite3";

// SQLiteの共通接続関数
export async function getDBConnection(): Promise<Database> {
  return open({
    filename: "./data/blog.db", // DBファイルパス
    driver: sqlite3.Database,
  });
}

// 汎用SELECT関数（複数件）
export async function fetchAll<T = any>(
  sql: string,
  params: any[] = []
): Promise<T[]> {
  const db = await getDBConnection();
  const rows = await db.all<T[]>(sql, params);
  return rows;
}

// 1件だけ取得するSELECT関数（件数カウントなどに使用）
export async function fetchOne<T = any>(
  sql: string,
  params: any[] = []
): Promise<T | undefined> {
  const db = await getDBConnection();
  const row = await db.get<T>(sql, params);
  return row;
}

// 汎用実行関数（INSERT/UPDATE/DELETE）
export async function execute(sql: string, params: any[] = []): Promise<void> {
  const db = await getDBConnection();
  await db.run(sql, params);
}
