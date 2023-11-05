const Post = require("../models/postModel");

exports.getPosts = async (req, res) => {
  try {
    const post = await Post.find();
    return res.send({ status: "ok", count: post.length, data: post });
  } catch (error) {
    res.send({ status: "some problem happen" });
  }
};
exports.getPostById = async (req, res) => {
  try {
    const postId = req.params.postId;

    const post = await Post.findById(postId);
    return res.send({ status: "ok", count: post.length, data: post });
  } catch (error) {
    return res.send({ status: "data not found" });
  }
};

exports.getPostByEmail = async (req, res) => {
  try {
    const email = req.query.email;
    console.log(email);
    const post = await Post.find({ postUserEmail: email });
    return res.send({ status: "ok", count: post.length, data: post });
  } catch (error) {
    res.send({ status: "data not found" });
  }
};

exports.postPost = async (req, res) => {
  const post = req.body;
  try {
    const result = await Post.create(post);
    return res.send({
      status: "ok",
      message: "your post publish scccessfully",
      data: result,
    });
  } catch (error) {
    return res.send({ status: "some problem happen", Error: error });
  }
};
exports.postComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const comment = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.json({ status: "Post not found" });
    }

    post.comments.push(comment);
    await post.save();

    res.send({ status: "ok", data: "your have commented scccessfully" });
  } catch (error) {
    console.error("Error adding like", error);
    res.send({ status: "some problem happen" });
  }
};
exports.postLike = async (req, res) => {
  try {
    const postId = req.params.postId;
    const like = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.json({ status: "Post not found" });
    }
    const alreadylike = post?.likes?.find(
      (user) => user.likedUserName === like.likedUserName
    );
    if (alreadylike) {
      return res.json({ status: "you already liked" });
    }

    post.likes.push(like);
    await post.save();

    res.send({ status: "ok", data: "your have like scccessfully" });
  } catch (error) {
    console.error("Error adding like", error);
    res.send({ status: "some problem happen" });
  }
};
exports.updatePost = async (req, res) => {
  try {
    const id = req.params.id;
    const { updatetext, date } = req.body;
    const result = await Post.updateOne(
      { _id: id },

      {
        $set: {
          text: updatetext,
          date: date,
        },
      }
    );
    res.send({ status: "ok", data: result });
  } catch (error) {
    res.send({ status: "some problem happen" });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const result = await Post.findByIdAndRemove(postId);
    if (result) {
      res.json({ status: "ok", message: "Document deleted successfully" });
    } else {
      res.json({ status: "bad", message: "Document cant deleted " });
    }
  } catch (error) {
    res.json({ status: "bad", message: "Document cant deleted " });
  }
};
