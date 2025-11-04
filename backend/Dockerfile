# ====== ビルドステージ ======
FROM node:22.5-bullseye AS builder

# 作業ディレクトリ
WORKDIR /app

# package.json と package-lock.json をコピー
COPY package*.json ./
COPY tsconfig*.json ./

# 依存関係インストール
RUN npm ci

# ソースコードをコピー（本番データを除く）
COPY ./src ./src
COPY ./etc ./etc

# TypeScript ビルド
RUN npm run build

# ====== 実行ステージ ======
FROM node:22.5-slim

WORKDIR /app

# 本番依存関係のみインストール
COPY package*.json ./
RUN npm ci --only=production

# ビルド成果物と設定だけコピー
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/etc ./etc

# sqlite3 をインストール
RUN apt-get update && apt-get install -y sqlite3 && rm -rf /var/lib/apt/lists/*

# SQLファイルもコピー（scheduler用）
RUN mkdir -p ./dist/db
COPY ./src/db/schema.sql ./dist/db/schema.sql

# エントリポイント設定
RUN chmod +x /app/etc/entrypoint.sh
ENTRYPOINT ["/app/etc/entrypoint.sh"]
CMD ["node", "dist/scheduler.js"]

