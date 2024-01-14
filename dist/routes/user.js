"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("../middleware/auth"));
const user_1 = require("../controllers/user");
const express_1 = __importDefault(require("express"));
const upload_1 = __importDefault(require("../middleware/upload"));
const router = express_1.default.Router();
router.post("/signup", user_1.signup);
router.post("/signin", user_1.signin);
router.get("/", auth_1.default, user_1.getCurrentUser);
router.get("/:userId", auth_1.default, user_1.getUserById);
router.put("/save-post", auth_1.default, user_1.savePost);
router.put("/update", auth_1.default, upload_1.default.single("profile"), user_1.updateProfile);
exports.default = router;
//# sourceMappingURL=user.js.map