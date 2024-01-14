"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoosePaginate = require("mongoose-paginate-v2");
const PostSchema = new mongoose_1.default.Schema({
    creator: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    likes: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    caption: {
        type: String,
    },
    tags: [
        {
            type: String,
        },
    ],
    imageUrl: {
        type: String,
        required: true,
    },
    imageId: {
        type: String,
        required: true,
    },
    location: {
        type: String,
    },
    saved: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
}, {
    timestamps: true,
});
PostSchema.plugin(mongoosePaginate);
const Post = mongoose_1.default.model("Post", PostSchema);
exports.default = Post;
//# sourceMappingURL=post.js.map