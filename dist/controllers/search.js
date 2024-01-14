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
exports.searchPosts = void 0;
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
const post_1 = __importDefault(require("../models/post"));
const searchPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { q: searchQuery, p: page } = req.query;
    if (!searchQuery)
        return res.status(204).json(new ApiResponse_1.default(204, "Search query empty", []));
    try {
        const regex = new RegExp(String(searchQuery), "i");
        // @ts-ignore
        const posts = yield post_1.default.paginate({ $or: [{ caption: { $regex: regex } }, { tags: { $in: [regex] } }] }, {
            page,
            limit: 10,
            populate: "creator",
        });
        return res.status(200).json(new ApiResponse_1.default(200, "", posts));
    }
    catch (error) {
        console.error("Error searching posts:", error);
        return res.status(500).json(new ApiResponse_1.default(200, "Couldn't Search Posts"));
    }
});
exports.searchPosts = searchPosts;
//# sourceMappingURL=search.js.map