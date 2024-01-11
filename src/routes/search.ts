import express from "express";

import { searchPosts } from "../controllers/post";
import auth from "../middleware/auth";

const router = express.Router();

router.get("/post", auth, searchPosts);

export default router;
