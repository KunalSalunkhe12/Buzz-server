import auth from "../middleware/auth";
import { getCurrentUser, savePost, signin, signup } from "../controllers/user";
import express from "express";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/", auth, getCurrentUser);
router.put("/save-post", auth, savePost);

export default router;
