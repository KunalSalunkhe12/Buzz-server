"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.likePost = exports.createPost = exports.getPosts = exports.getRecentPosts = exports.getPostById = void 0;
const post_1 = __importDefault(require("../models/post"));
const cloudinary_1 = require("../utils/cloudinary");
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
const compressFile_1 = require("../utils/compressFile");
const user_1 = __importDefault(require("../models/user"));
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    if (!postId) {
        return res.status(400).json(new ApiResponse_1.default(400, "All postId is required"));
    }
    try {
        const post = yield post_1.default.findById({ _id: postId }).populate("creator");
        if (!post) {
            res.status(404).json(new ApiResponse_1.default(404, "Post doesn't exist"));
        }
        return res
            .status(200)
            .json(new ApiResponse_1.default(200, "Post fetched successfully", post));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new ApiResponse_1.default(500, "Can't fetch Post"));
    }
});
exports.getPostById = getPostById;
const getRecentPosts = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recentPost = yield post_1.default.find()
            .limit(20)
            .populate("creator")
            .sort({ createdAt: -1 });
        if (recentPost.length < 1)
            return res
                .status(200)
                .json(new ApiResponse_1.default(200, "No post available", []));
        return res.status(200).json(new ApiResponse_1.default(200, "", recentPost));
    }
    catch (error) {
        console.log("error");
        return res.status(500).json(new ApiResponse_1.default(500, "Couldn't get posts"));
    }
});
exports.getRecentPosts = getRecentPosts;
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page } = req.query;
    const limit = 10;
    try {
        // @ts-ignore
        const paginatedPosts = yield post_1.default.paginate({}, {
            page: page,
            limit: limit,
            sort: { createdAt: -1 },
            populate: "creator",
        });
        return res
            .status(200)
            .json(new ApiResponse_1.default(200, "Posts fetch Successful", paginatedPosts));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new ApiResponse_1.default(500, "Could not fetch posts"));
    }
});
exports.getPosts = getPosts;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { caption, location, tags } = req.body;
    const image = req.file;
    const user = req.user;
    const tagsArr = tags.split(", ");
    try {
        if (!(image === null || image === void 0 ? void 0 : image.buffer)) {
            return res.status(400).json(new ApiResponse_1.default(400, "Image not available"));
        }
        const { compressedFile, compressedImagePath } = yield (0, compressFile_1.compressFile)(image);
        if (!compressedFile) {
            return res
                .status(400)
                .json(new ApiResponse_1.default(400, "Couldn't compress image"));
        }
        const cloudinary = yield (0, cloudinary_1.uploadOnCloudinary)(compressedImagePath);
        const imageUrl = cloudinary === null || cloudinary === void 0 ? void 0 : cloudinary.url;
        yield post_1.default.create({
            creator: user === null || user === void 0 ? void 0 : user.id,
            caption,
            location,
            tags: tagsArr,
            imageUrl,
            imageId: cloudinary === null || cloudinary === void 0 ? void 0 : cloudinary.public_id,
        });
        return res
            .status(201)
            .json(new ApiResponse_1.default(200, "Post created successfully"));
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(new ApiResponse_1.default(500, "Something went wrong.Please try again"));
    }
});
exports.createPost = createPost;
const likePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const { likesList } = req.body;
    if (!postId || !likesList) {
        return res
            .status(400)
            .json(new ApiResponse_1.default(400, "All fields are required"));
    }
    try {
        yield post_1.default.updateOne({ _id: postId }, { $set: { likes: likesList } });
        return res
            .status(200)
            .json(new ApiResponse_1.default(200, "Post updated successfully"));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new ApiResponse_1.default(500, "Couldn't update post"));
    }
});
exports.likePost = likePost;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { caption, location, tags } = req.body;
    const { postId } = req.params;
    const tagsArr = tags.split(", ");
    try {
        const updatedPostData = {
            caption,
            location,
            tags: tagsArr,
        };
        const updatedPost = yield post_1.default.findByIdAndUpdate(postId, { $set: updatedPostData }, { new: true });
        return res
            .status(200)
            .json(new ApiResponse_1.default(200, "Post updated successfully", updatedPost));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new ApiResponse_1.default(500, "Couldn't update Post"));
    }
});
exports.updatePost = updatePost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    try {
        yield user_1.default.updateMany({ savedPosts: postId }, { $pull: { savedPosts: postId } });
        const post = yield post_1.default.findById({ _id: postId });
        if (!post)
            return res.status(404).json(new ApiResponse_1.default(404, "Post does not exist"));
        const response = yield (0, cloudinary_1.deleteOnCloudinary)(post.imageId);
        if (response.result !== "ok")
            res
                .status(500)
                .json(new ApiResponse_1.default(500, "Couldn't delete image on cloudinary"));
        yield post_1.default.findByIdAndDelete({ _id: postId });
        return res
            .status(200)
            .json(new ApiResponse_1.default(200, "Post deleted successfully"));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new ApiResponse_1.default(500, "Couldn't delete Post"));
    }
});
exports.deletePost = deletePost;
//# sourceMappingURL=post.js.map