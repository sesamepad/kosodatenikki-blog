import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import adminRoutes from "./routes/admin";
import contactRouter from "./routes/contact";
import postRouter from "./routes/post";
import postsRouter from "./routes/posts";
import relationPostsRouter from "./routes/relationPosts";

const app = express();

// 環境変数からフロントのオリジンを取得
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());
app.set("trust proxy", true);
app.use("/images", express.static("/app/posts"));
app.use("/data", express.static("/app/data"));

app.use("/api/posts", postsRouter);
app.use("/api/post", postRouter);
app.use("/api/relation-posts", relationPostsRouter);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRouter);

// OPTIONS リクエストに対応
app.options("*", cors());

app.listen(3001, "0.0.0.0", () => {
  console.log("API listening on port 3001");
});
