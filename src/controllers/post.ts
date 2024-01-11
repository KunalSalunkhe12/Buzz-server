import { Request, Response } from "express";
import Post from "../models/post";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary";
import ApiResponse from "../utils/ApiResponse";
import { TUpdatePost } from "types";
import { compressFile } from "../utils/compressFile";
import User from "../models/user";

export const getPostById = async (req: Request, res: Response) => {
  const { postId } = req.params;

  if (!postId) {
    return res.status(400).json(new ApiResponse(400, "All postId is required"));
  }

  try {
    const post = await Post.findById({ _id: postId }).populate("creator");
    if (!post) {
      res.status(404).json(new ApiResponse(404, "Post doesn't exist"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Post fetched successfully", post));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiResponse(500, "Can't fetch Post"));
  }
};

export const getRecentPosts = async (_: Request, res: Response) => {
  try {
    const recentPost = await Post.find()
      .limit(20)
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

export const getPosts = async (req: Request, res: Response) => {
  const { page } = req.query;
  const limit = 10;
  try {
    // @ts-ignore
    const paginatedPosts = await Post.paginate(
      {},
      {
        page: page,
        limit: limit,
        sort: { createdAt: -1 },
        populate: "creator",
      }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, "Posts fetch Successful", paginatedPosts));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiResponse(500, "Could not fetch posts"));
  }
};

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

    const { compressedFile, compressedImagePath } = await compressFile(image);

    if (!compressedFile) {
      return res
        .status(400)
        .json(new ApiResponse(400, "Couldn't compress image"));
    }

    const cloudinary = await uploadOnCloudinary(compressedImagePath);
    const imageUrl = cloudinary?.url;

    await Post.create({
      creator: user?.id,
      caption,
      location,
      tags: tagsArr,
      imageUrl,
      imageId: cloudinary?.public_id,
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

export const likePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { likesList } = req.body;

  if (!postId || !likesList) {
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

type UpdatePostRequestBody = {
  imageUrl: string;
  caption: string;
  location: string;
  tags: string;
  imageId: string;
};

export const updatePost = async (
  req: Request<any, any, UpdatePostRequestBody>,
  res: Response
) => {
  const { caption, location, tags } = req.body;
  const { postId } = req.params;
  const tagsArr = tags.split(", ");

  try {
    const updatedPostData: TUpdatePost = {
      caption,
      location,
      tags: tagsArr,
    };

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $set: updatedPostData },
      { new: true }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, "Post updated successfully", updatedPost));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiResponse(500, "Couldn't update Post"));
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const { postId } = req.params;

  try {
    await User.updateMany(
      { savedPosts: postId },
      { $pull: { savedPosts: postId } }
    );

    const post = await Post.findById({ _id: postId });
    if (!post)
      return res.status(404).json(new ApiResponse(404, "Post does not exist"));

    const response = await deleteOnCloudinary(post.imageId);

    if (response.result !== "ok")
      res
        .status(500)
        .json(new ApiResponse(500, "Couldn't delete image on cloudinary"));

    await Post.findByIdAndDelete({ _id: postId });

    return res
      .status(200)
      .json(new ApiResponse(200, "Post deleted successfully"));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiResponse(500, "Couldn't delete Post"));
  }
};
