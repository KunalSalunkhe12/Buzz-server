import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import User from "../models/user";
import ApiResponse from "../utils/ApiResponse";
import Post from "../models/post";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary";
import { compressFile } from "../utils/compressFile";

export const signup = async (req: Request, res: Response) => {
  const { name, username, password, email } = req.body;

  if (!name || !username || !password || !email) {
    return res
      .status(400)
      .json(new ApiResponse(400, "All fields are required!"));
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json(new ApiResponse(400, "User already Exist"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await User.create({
      name,
      username,
      password: hashedPassword,
      email,
    });

    const token = jwt.sign(
      { email: result.email, id: result._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, "User created successfully", token));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiResponse(500, "Couldn't Create User"));
  }
};

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json(new ApiResponse(400, "All fields are required"));
  }

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser)
      return res.status(404).json(new ApiResponse(404, "User does not Exist!"));

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return res.status(400).json(new ApiResponse(400, "Invalid Credentials"));

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "3h" }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, "Sign in successfully", token));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiResponse(500, "Couldn't sign in user"));
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const email = req.user?.email;

  try {
    const currentUser = await User.findOne({ email }).populate("savedPosts");

    return res.status(200).json(new ApiResponse(200, "", currentUser));
  } catch (error) {
    console.log(error);
    return res.status(404).json(new ApiResponse(404, "User not found"));
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const result = await User.findById({ _id: userId });

    if (!result) {
      return res.status(404).json(new ApiResponse(404, "User not found"));
    }
    const posts = await Post.find({ creator: userId }).populate("creator");

    const cleanedUser = result.toObject();

    return res
      .status(200)
      .json(new ApiResponse(200, "", { ...cleanedUser, posts }));
  } catch (error) {
    console.log(error);
    return res.status(404).json(new ApiResponse(404, "User not found"));
  }
};

export const savePost = async (req: Request, res: Response) => {
  const user = req.user;
  const { savedPostsList } = req.body;

  if (!savedPostsList)
    return res
      .status(400)
      .json(new ApiResponse(400, "All fields are required"));

  try {
    await User.updateOne(
      { _id: user?.id },
      { $set: { savedPosts: savedPostsList } }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, "User updated successfully"));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiResponse(500, "Couldn't Save post"));
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  const user = req.user;
  const image = req.file;
  const { name, bio, username, imageId } = req.body;

  try {
    if (image) {
      if (!image.buffer) {
        return res
          .status(400)
          .json(new ApiResponse(400, "Image not available"));
      }

      if (imageId) {
        const deleteResponse = await deleteOnCloudinary(imageId);

        if (deleteResponse.result !== "ok") {
          return res
            .status(500)
            .json(new ApiResponse(500, "Couldn't delete image on cloudinary"));
        }
      }

      const { compressedFile, compressedImagePath } = await compressFile(image);

      if (!compressedFile) {
        return res
          .status(400)
          .json(new ApiResponse(400, "Couldn't compress image"));
      }

      const cloudinary = await uploadOnCloudinary(compressedImagePath);

      const updatedUserData = {
        name,
        bio,
        username,
        imageUrl: cloudinary?.url,
        imageId: cloudinary?.public_id,
      };

      const updatedUser = await User.findByIdAndUpdate(
        { _id: user?.id },
        { $set: updatedUserData },
        { new: true }
      );

      return res
        .status(200)
        .json(new ApiResponse(200, "User updated successfully", updatedUser));
    } else {
      const updatedUserData = {
        name,
        bio,
        username,
      };

      const updatedUser = await User.findByIdAndUpdate(
        { _id: user?.id },
        { $set: updatedUserData },
        { new: true }
      );

      return res
        .status(200)
        .json(new ApiResponse(200, "User updated successfully", updatedUser));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(new ApiResponse(500, "Couldn't update user"));
  }
};
