import express from "express";

import { searchPosts } from "../controllers/search";
import auth from "../middleware/auth";

const router = express.Router();

router.get("/post", auth, searchPosts);

export default router;
