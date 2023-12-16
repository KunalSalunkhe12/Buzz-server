import express from "express";
import { get } from "lodash";

export const createPost = (req: express.Request, res: express.Response) => {
  console.log(req.file, get(req, "user"));

  res.json(req.body);
};
