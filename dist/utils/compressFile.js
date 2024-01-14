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
exports.compressFile = void 0;
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const compressFile = (image) => __awaiter(void 0, void 0, void 0, function* () {
    const compressedImagePath = path_1.default.join("/tmp", Date.now().toString() + image.originalname);
    const { orientation } = yield (0, sharp_1.default)(image.buffer).metadata();
    const rotate = orientation && orientation >= 5 ? 90 : 0;
    const compressedFile = yield (0, sharp_1.default)(image.buffer)
        .webp({ quality: 70 })
        .rotate(rotate)
        .toFile(compressedImagePath);
    return { compressedFile, compressedImagePath };
});
exports.compressFile = compressFile;
//# sourceMappingURL=compressFile.js.map