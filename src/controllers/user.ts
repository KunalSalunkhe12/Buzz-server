import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import User from "../models/user";
import ApiResponse from "../utils/ApiResponse";

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
