# デプロイ手順

## 1. WSL に入る（Windows の場合）

```bash
wsl
```

## 2. Docker Hub にログイン

```bash
docker login
```

## 3. イメージをプル

```bash
sudo docker pull sesame830/blog-backend:latest
```

```bash
sudo docker pull sesame830/blog-frontend:latest
```

```bash
sudo docker pull sesame830/blog-scheduler:latest
```

## 4. イメージをホスト PC に保存

```bash
sudo docker save -o blog-backend.tar sesame830/blog-backend:latest
```

```bash
sudo docker save -o blog-frontend.tar sesame830/blog-frontend:latest
```

```bash
sudo docker save -o blog-scheduler.tar sesame830/blog-scheduler:latest
```

## 5. 本番環境にコピー保存（SCP）

```bash
scp -P <SSHポート番号> blog-backend.tar blog-frontend.tar blog-scheduler.tar <ユーザ名>@<ホスト名>:/home/sesame/
```

## 6. 本番環境にログイン

```bash
ssh -P <SSHポート番号> <ユーザ名>@<ホスト名>
```

## 7. イメージをロード

```bash
sudo docker load -i blog-backend.tar
```

```bash
sudo docker load -i blog-frontend.tar
```

```bash
sudo docker load -i blog-scheduler.tar
```

## 8. ディレクトリ移動して、Docker Compose 起動

```bash
cd /var/www/<ディレクトリ名>
```

```bash
sudo docker compose up -d
```
