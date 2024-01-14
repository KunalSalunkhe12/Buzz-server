import path from "path";
import sharp from "sharp";

export const compressFile = async (image: Express.Multer.File) => {
  let compressedImagePath: string;
  if (process.env.NODE_ENV === "development") {
    compressedImagePath = path.join(
      __dirname,
      "..",
      "..",
      "uploads",
      Date.now().toString() + image.originalname
    );
  } else {
    compressedImagePath = path.join(
      "/tmp",
      Date.now().toString() + image.originalname
    );
  }

  const { orientation } = await sharp(image.buffer).metadata();
  const rotate = orientation && orientation >= 5 ? 90 : 0;

  const compressedFile = await sharp(image.buffer)
    .webp({ quality: 70 })
    .rotate(rotate)
    .toFile(compressedImagePath);

  return { compressedFile, compressedImagePath };
};
