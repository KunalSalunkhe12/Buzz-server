import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import User from "../models/user";

export const signup = async (req: express.Request, res: express.Response) => {
  const { name, username, password, email } = req.body;

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

    return res.status(200).json({ token, result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

export const signin = async (req: express.Request, res: express.Response) => {
  const { email, password } = req.body;
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
    return res.status(200).json({ result: existingUser, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
