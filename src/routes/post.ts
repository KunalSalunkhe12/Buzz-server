import express from "express";

import { createPost } from "controllers/post";
import { upload } from "middleware/upload";

const router = express.Router();

router.post("/", upload.single("file"), createPost);

export default router;
