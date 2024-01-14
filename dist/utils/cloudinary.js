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
exports.deleteOnCloudinary = exports.uploadOnCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});
const uploadOnCloudinary = (localFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield cloudinary_1.v2.uploader.upload(localFilePath, {
            resource_type: "image",
            transformation: { angle: "ignore" },
            exif: false,
        });
        if (response) {
            fs_1.default.unlinkSync(localFilePath);
        }
        return response;
    }
    catch (error) {
        console.log(error);
        fs_1.default.unlinkSync(localFilePath);
        return null;
    }
});
exports.uploadOnCloudinary = uploadOnCloudinary;
const deleteOnCloudinary = (publicId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield cloudinary_1.v2.uploader.destroy(publicId, {
            resource_type: "image",
        });
        return response;
    }
    catch (error) {
        console.log(error);
    }
});
exports.deleteOnCloudinary = deleteOnCloudinary;
//# sourceMappingURL=cloudinary.js.map