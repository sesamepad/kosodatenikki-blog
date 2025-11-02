import express from "express";
import adminAuthRouter from "./adminAuth";
import categoriesRouter from "./categoryRoutes";
import createPost from "./createPost";
import dashboardCounts from "./dashboardCounts";
import draftPost from "./draftPost";
import draftsRouter from "./draftRoutes";
import images from "./images";
import logout from "./logout";
import Posts from "./posts";
import tagsRouter from "./tagRoutes";
import thumbnail from "./thumbnail";

const router = express.Router();

router.use("/login", adminAuthRouter);
router.use("/dashboard-counts", dashboardCounts);
router.use("/drafts", draftsRouter);
router.use("/create-post", createPost);
router.use("/post", draftPost);
router.use("/posts", Posts);
router.use("/categories", categoriesRouter);
router.use("/tags", tagsRouter);
router.use("/thumbnail", thumbnail);
router.use("/images", images);
router.use("/logout", logout);

export default router;
