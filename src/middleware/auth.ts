import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ error: "Missing auth token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = <any>jwt.verify(token, process.env.JWT_SECRET as string);

    req.user = decoded;
    next();
    return;
  } catch (err) {
    console.error(err);
    return res.status(401).send({ error: "Invalid auth token" });
  }
};

export default auth;
