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
exports.updateProfile = exports.savePost = exports.getUserById = exports.getCurrentUser = exports.signin = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = __importDefault(require("../models/user"));
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
const post_1 = __importDefault(require("../models/post"));
const cloudinary_1 = require("../utils/cloudinary");
const compressFile_1 = require("../utils/compressFile");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, username, password, email } = req.body;
    if (!name || !username || !password || !email) {
        return res
            .status(400)
            .json(new ApiResponse_1.default(400, "All fields are required!"));
    }
    try {
        const existingUser = yield user_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json(new ApiResponse_1.default(400, "User already Exist"));
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const result = yield user_1.default.create({
            name,
            username,
            password: hashedPassword,
            email,
        });
        const token = jsonwebtoken_1.default.sign({ email: result.email, id: result._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        return res
            .status(200)
            .json(new ApiResponse_1.default(200, "User created successfully", token));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new ApiResponse_1.default(500, "Couldn't Create User"));
    }
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res
            .status(400)
            .json(new ApiResponse_1.default(400, "All fields are required"));
    }
    try {
        const existingUser = yield user_1.default.findOne({ email });
        if (!existingUser)
            return res.status(404).json(new ApiResponse_1.default(404, "User does not Exist!"));
        const isPasswordCorrect = yield bcryptjs_1.default.compare(password, existingUser.password);
        if (!isPasswordCorrect)
            return res.status(400).json(new ApiResponse_1.default(400, "Invalid Credentials"));
        const token = jsonwebtoken_1.default.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "3h" });
        return res
            .status(200)
            .json(new ApiResponse_1.default(200, "Sign in successfully", token));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new ApiResponse_1.default(500, "Couldn't sign in user"));
    }
});
exports.signin = signin;
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    try {
        const currentUser = yield user_1.default.findOne({ email }).populate("savedPosts");
        return res.status(200).json(new ApiResponse_1.default(200, "", currentUser));
    }
    catch (error) {
        console.log(error);
        return res.status(404).json(new ApiResponse_1.default(404, "User not found"));
    }
});
exports.getCurrentUser = getCurrentUser;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const result = yield user_1.default.findById({ _id: userId });
        if (!result) {
            return res.status(404).json(new ApiResponse_1.default(404, "User not found"));
        }
        const posts = yield post_1.default.find({ creator: userId }).populate("creator");
        const cleanedUser = result.toObject();
        return res
            .status(200)
            .json(new ApiResponse_1.default(200, "", Object.assign(Object.assign({}, cleanedUser), { posts })));
    }
    catch (error) {
        console.log(error);
        return res.status(404).json(new ApiResponse_1.default(404, "User not found"));
    }
});
exports.getUserById = getUserById;
const savePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { savedPostsList } = req.body;
    if (!savedPostsList)
        return res
            .status(400)
            .json(new ApiResponse_1.default(400, "All fields are required"));
    try {
        yield user_1.default.updateOne({ _id: user === null || user === void 0 ? void 0 : user.id }, { $set: { savedPosts: savedPostsList } });
        return res
            .status(200)
            .json(new ApiResponse_1.default(200, "User updated successfully"));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new ApiResponse_1.default(500, "Couldn't Save post"));
    }
});
exports.savePost = savePost;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const image = req.file;
    const { name, bio, username, imageId } = req.body;
    try {
        if (image) {
            if (!image.buffer) {
                return res
                    .status(400)
                    .json(new ApiResponse_1.default(400, "Image not available"));
            }
            if (imageId) {
                const deleteResponse = yield (0, cloudinary_1.deleteOnCloudinary)(imageId);
                if (deleteResponse.result !== "ok") {
                    return res
                        .status(500)
                        .json(new ApiResponse_1.default(500, "Couldn't delete image on cloudinary"));
                }
            }
            const { compressedFile, compressedImagePath } = yield (0, compressFile_1.compressFile)(image);
            if (!compressedFile) {
                return res
                    .status(400)
                    .json(new ApiResponse_1.default(400, "Couldn't compress image"));
            }
            const cloudinary = yield (0, cloudinary_1.uploadOnCloudinary)(compressedImagePath);
            const updatedUserData = {
                name,
                bio,
                username,
                imageUrl: cloudinary === null || cloudinary === void 0 ? void 0 : cloudinary.url,
                imageId: cloudinary === null || cloudinary === void 0 ? void 0 : cloudinary.public_id,
            };
            const updatedUser = yield user_1.default.findByIdAndUpdate({ _id: user === null || user === void 0 ? void 0 : user.id }, { $set: updatedUserData }, { new: true });
            return res
                .status(200)
                .json(new ApiResponse_1.default(200, "User updated successfully", updatedUser));
        }
        else {
            const updatedUserData = {
                name,
                bio,
                username,
            };
            const updatedUser = yield user_1.default.findByIdAndUpdate({ _id: user === null || user === void 0 ? void 0 : user.id }, { $set: updatedUserData }, { new: true });
            return res
                .status(200)
                .json(new ApiResponse_1.default(200, "User updated successfully", updatedUser));
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json(new ApiResponse_1.default(500, "Couldn't update user"));
    }
});
exports.updateProfile = updateProfile;
//# sourceMappingURL=user.js.map