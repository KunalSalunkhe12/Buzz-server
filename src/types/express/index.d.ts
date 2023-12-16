import express from "express";
import { JwtPayload } from "jsonwebtoken";
import { TUser } from "types";

declare global {
  namespace Express {
    interface Request {
      user?: TUser;
    }
  }
}
