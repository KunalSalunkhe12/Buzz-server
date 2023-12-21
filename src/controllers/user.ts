import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import User from "../models/user";

export const signup = async (req: Request, res: Response) => {
  const { name, username, password, email } = req.body;

  if (!name || !username || !password || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
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

    return res.status(200).json(token);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong. Please Try again" });
  }
};

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser)
      return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "3h" }
    );
    return res.status(200).json(token);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong. Please Try again" });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const email = req.user?.email;

  try {
    const currentUser = await User.findOne({ email });

    return res.status(200).json(currentUser);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "User Not found" });
  }
};
