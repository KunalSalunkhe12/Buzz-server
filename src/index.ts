import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
dotenv.config();

import userRoutes from "./routes/user";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/", (_, res) => {
  res.send("Buzz api");
});

app.use("/user", userRoutes);

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
