import express from "express";

import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  getRecentPosts,
  likePost,
  updatePost,
} from "../controllers/post";
import upload from "../middleware/upload";
import auth from "../middleware/auth";

const router = express.Router();

router.get("/", auth, getPosts);
router.post("/", auth, upload.single("image"), createPost);
router.get("/recent", auth, getRecentPosts);
router.put("/like/:postId", auth, likePost);
router.get("/:postId", auth, getPostById);
router.put("/:postId", auth, upload.single("image"), updatePost);
router.delete("/:postId", auth, deletePost);

export default router;
