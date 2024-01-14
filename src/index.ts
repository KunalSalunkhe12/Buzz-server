import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
dotenv.config();

import userRoutes from "./routes/user";
import postRoutes from "./routes/post";
import searchRoutes from "./routes/search";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/", (_req, res) => {
  res.send("Buzz api");
});

app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/search", searchRoutes);

const PORT = process.env.PORT;

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    app.listen(process.env.PORT, () => {
      console.log(`Server listening on PORT ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
