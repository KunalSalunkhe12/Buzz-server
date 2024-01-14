import auth from "../middleware/auth";
import {
  getCurrentUser,
  getUserById,
  savePost,
  signin,
  signup,
  updateProfile,
} from "../controllers/user";
import express from "express";
import upload from "../middleware/upload";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/", auth, getCurrentUser);
router.get("/:userId", auth, getUserById);
router.put("/save-post", auth, savePost);
router.put("/update", auth, upload.single("profile"), updateProfile);

export default router;
