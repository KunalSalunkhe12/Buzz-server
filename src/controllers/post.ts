import { Request, Response } from "express";
import Post from "../models/post";
import { uploadOnCloudinary } from "../utils/cloudinary";
import sharp from "sharp";
import path from "path";
import ApiResponse from "utils/ApiResponse";

type CreatePostRequestBody = {
  caption: string;
  location: string;
  tags: string;
};

export const createPost = async (
  req: Request<any, any, CreatePostRequestBody>,
  res: Response
) => {
  const { caption, location, tags } = req.body;
  const image = req.file;
  const user = req.user;
  const tagsArr = tags.split(", ");

  try {
    if (!image?.buffer) {
      return res.status(400).json(new ApiResponse(400, "Image not available"));
    }

    const compressedImagePath = path.join(
      __dirname,
      "..",
      "..",
      "uploads",
      Date.now().toString() + image.originalname
    );

    const compressedFile = await sharp(image.buffer)
      .jpeg({ quality: 80 })
      .toFile(compressedImagePath);

    if (!compressedFile) {
      return res
        .status(400)
        .json(new ApiResponse(400, "Couldn't compress image"));
    }

    const imageUrl = await uploadOnCloudinary(compressedImagePath);

    await Post.create({
      creator: user?.id,
      caption,
      location,
      tags: tagsArr,
      imageUrl,
    });

    return res
      .status(201)
      .json(new ApiResponse(200, "Post created successfully"));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, "Something went wrong.Please try again"));
  }
};

export const getRecentPosts = async (_: Request, res: Response) => {
  try {
    const recentPost = await Post.find()
      .populate("creator")
      .sort({ createdAt: -1 });

    if (recentPost.length < 1)
      return res
        .status(200)
        .json(new ApiResponse(200, "No post available", []));

    return res.status(200).json(new ApiResponse(200, "", recentPost));
  } catch (error) {
    console.log("error");
    return res.status(500).json(new ApiResponse(500, "Couldn't get posts"));
  }
};

export const likePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { likesList } = req.body;

  if (!postId || likesList) {
    return res
      .status(400)
      .json(new ApiResponse(400, "All fields are required"));
  }

  try {
    await Post.updateOne({ _id: postId }, { $set: { likes: likesList } });
    return res
      .status(200)
      .json(new ApiResponse(200, "Post updated successfully"));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiResponse(500, "Couldn't update post"));
  }
};
