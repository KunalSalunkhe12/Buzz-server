import express from "express";

import { createPost, getRecentPosts, likePost } from "../controllers/post";
import upload from "../middleware/upload";
import auth from "../middleware/auth";

const router = express.Router();

router.post("/", auth, upload.single("image"), createPost);
router.get("/", auth, getRecentPosts);
router.put("/like/:postId", auth, likePost);

export default router;
