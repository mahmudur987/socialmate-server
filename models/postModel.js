const mongoose = require("mongoose");

const postsScehma = new mongoose.Schema({
  postUserName: { type: String, require: true },
  postUserEmail: { type: String, require: true },
  text: { type: String, require: true },
  likes: Array,
  comments: Array,
  date: { type: String, default: Date.now() },
});

const Post = mongoose.model("posts", postsScehma);

module.exports = Post;
