import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  caption: {
    type: String,
    required: true,
  },
  tags: [
    {
      type: String,
    },
  ],
  imageUrl: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  saved: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Post = mongoose.model("Post", PostSchema);

export default Post;
