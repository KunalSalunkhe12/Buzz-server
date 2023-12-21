import auth from "../middleware/auth";
import { getCurrentUser, signin, signup } from "../controllers/user";
import express from "express";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/", auth, getCurrentUser);

export default router;
