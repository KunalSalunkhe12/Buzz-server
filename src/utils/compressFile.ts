import path from "path";
import sharp from "sharp";

export const compressFile = async (image: Express.Multer.File) => {
  const compressedImagePath = path.join(
    __dirname,
    "..",
    "..",
    "uploads",
    Date.now().toString() + image.originalname
  );

  const compressedFile = await sharp(image.buffer)
    .webp({ quality: 70 })
    .toFile(compressedImagePath);

  return { compressedFile, compressedImagePath };
};
