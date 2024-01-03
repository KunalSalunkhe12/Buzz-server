import express from "express";

import {
  createPost,
  getPostById,
  getRecentPosts,
  likePost,
  updatePost,
} from "../controllers/post";
import upload from "../middleware/upload";
import auth from "../middleware/auth";

const router = express.Router();

router.post("/", auth, upload.single("image"), createPost);
router.get("/", auth, getRecentPosts);
router.get("/:postId", getPostById);
router.put("/like/:postId", auth, likePost);
router.put("/:postId", upload.single("image"), updatePost);

export default router;
