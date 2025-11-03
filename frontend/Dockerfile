# ====== ビルドステージ ======
FROM node:20-alpine AS build

# 作業ディレクトリ
WORKDIR /app

# パッケージ情報コピー
COPY package*.json ./

# 依存関係インストール
RUN npm ci

# ソースコードをコピー
COPY . .
COPY frontend/.env.production .env.production

# 本番ビルド
RUN npm run build

# ====== 実行ステージ ======
FROM nginx:alpine

# ビルド成果物を Nginx 配信ディレクトリへコピー
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx 設定をコピー（SPA用のリダイレクト対応）
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# キャッシュ・不要ファイル削除（軽量化）
RUN rm -rf /var/cache/apk/* && rm -rf /tmp/*

# ポート公開
EXPOSE 80

# Nginx 起動
CMD ["nginx", "-g", "daemon off;"]
