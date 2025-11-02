#!/bin/sh
set -e

echo "🟡 エントリーポイントを実行中です。"

DATA_DIR="/app/data"
DB_FILE="$DATA_DIR/blog.db"
SCHEMA_FILE="/app/dist/db/schema.sql"

# データディレクトリがなければ作成
mkdir -p "$DATA_DIR"

# SQLite が入っていない環境に備えて存在確認
if ! command -v sqlite3 >/dev/null 2>&1; then
  echo "⚠️ sqlite3コマンドが見つかりません。イメージにインストールされていることを確認してください。"
  exit 1
fi

# DB が存在しなければ初期化
if [ ! -f "$DB_FILE" ]; then
  echo "📦 $DB_FILE が見つかりませんでした. 初期化中..."

  if [ -f "$SCHEMA_FILE" ]; then
    sqlite3 "$DB_FILE" < "$SCHEMA_FILE"
    echo "✅ DBの初期化が完了しました。"
  else
    echo "❌ Schemaファイルが見つかりませんでした。: $SCHEMA_FILE"
    exit 1
  fi
else
  echo "🟢 データベースは既に存在しています。初期化をスキップします。"
fi

# 権限を安全に整える
chown -R node:node "$DATA_DIR" || true

# 実行コマンドを明示
echo "🚀 アプリを起動しました: $@"
exec "$@"