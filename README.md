# デプロイ手順

## 1. 本番環境にログイン

```bash
ssh -p <SSHポート番号> <ユーザ名>@<ホスト名>
```

## 2. ディレクトリ移動

```bash
cd /var/www/<ディレクトリ名>
```

## 3. 最新イメージを Docker Hub から取得

```bash
sudo docker compose pull
```

## 4. コンテナ起動・更新

```bash
sudo docker compose up -d
```

## （必要であれば）起動確認

動作確認

```bash
sudo docker ps
```

ログ確認

```bash
sudo docker compose logs -f
```
