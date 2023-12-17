import { Request, Response } from "express";
import Post from "../models/post";

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

  try {
    const tagsArr = tags.split(", ");

    await Post.create({
      creator: user?.id,
      caption,
      location,
      tags: tagsArr,
      imageUrl: image?.path,
    });

    res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong.Please try again" });
  }
};

export const getRecentPosts = async (_: Request, res: Response) => {
  try {
    const recentPost = await Post.find()
      .populate("creator")
      .sort({ createdAt: -1 });

    if (recentPost.length < 1) return res.status(404).json("No Post available");

    return res.status(200).json(recentPost);
  } catch (error) {
    console.log("error");
    return res.status(500).json({ message: "Couldn't to get Post" });
  }
};
