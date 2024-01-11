import { Request, Response } from "express";
import ApiResponse from "../utils/ApiResponse";
import Post from "../models/post";

export const searchPosts = async (req: Request, res: Response) => {
  const { q: searchQuery, p: page } = req.query;

  if (!searchQuery)
    return res.status(204).json(new ApiResponse(204, "Search query empty", []));

  try {
    const regex = new RegExp(String(searchQuery), "i");
    // @ts-ignore
    const posts = await Post.paginate(
      { $or: [{ caption: { $regex: regex } }, { tags: { $in: [regex] } }] },
      {
        page,
        limit: 10,
        populate: "creator",
      }
    );

    return res.status(200).json(new ApiResponse(200, "", posts));
  } catch (error) {
    console.error("Error searching posts:", error);
    return res.status(500).json(new ApiResponse(200, "Couldn't Search Posts"));
  }
};
