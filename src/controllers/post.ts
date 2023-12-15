import express from "express";

export const createPost = (req: express.Request, res: express.Response) => {
  console.log(req.body, req.file);

  res.json(req.body);
};
