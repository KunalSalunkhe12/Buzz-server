import auth from "../middleware/auth";
import {
  getCurrentUser,
  getUserById,
  savePost,
  signin,
  signup,
} from "../controllers/user";
import express from "express";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/", auth, getCurrentUser);
router.put("/save-post", auth, savePost);
router.get("/:userId", auth, getUserById);

export default router;
