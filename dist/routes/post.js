"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_1 = require("../controllers/post");
const upload_1 = __importDefault(require("../middleware/upload"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
router.get("/", auth_1.default, post_1.getPosts);
router.post("/", auth_1.default, upload_1.default.single("image"), post_1.createPost);
router.get("/recent", auth_1.default, post_1.getRecentPosts);
router.put("/like/:postId", auth_1.default, post_1.likePost);
router.get("/:postId", auth_1.default, post_1.getPostById);
router.put("/:postId", auth_1.default, upload_1.default.single("image"), post_1.updatePost);
router.delete("/:postId", auth_1.default, post_1.deletePost);
exports.default = router;
//# sourceMappingURL=post.js.map