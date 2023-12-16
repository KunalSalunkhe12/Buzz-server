import jwt from "jsonwebtoken";
import express from "express";
import { merge } from "lodash";

const auth = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ error: "Missing auth token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    merge(req, { user: decoded });
    next();
    return;
  } catch (err) {
    console.error(err);
    return res.status(401).send({ error: "Invalid auth token" });
  }
};

export default auth;
