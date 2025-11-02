import { exec } from "child_process";
import cron from "node-cron";

// 毎日0:00にアクセスログ集計
cron.schedule("0 0 * * *", () => {
  exec("node ./dist/scripts/accessLogBatch.js", (err, stdout, stderr) => {
    if (err) console.error(err);
    else console.log(stdout);
  });
});

// 毎日0:05に人気記事集計
cron.schedule("5 0 * * *", () => {
  exec("node ./dist/scripts/popularPosts.js", (err, stdout, stderr) => {
    if (err) console.error(err);
    else console.log(stdout);
  });
});

// 毎月1日1:00に使用済みトークン削除
cron.schedule("0 1 1 * *", () => {
  exec("node ./dist/scripts/cleadRevokedTokens.js", (err, stdout, stderr) => {
    if (err) console.error(err);
    else console.log(stdout);
  });
});
