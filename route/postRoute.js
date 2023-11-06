const express = require("express");
const router = express.Router();
const {
  getPostByEmail,
  getPosts,
  postPost,
  postComment,
  postLike,
  getPostById,
  updatePost,
  deletePost,
} = require("../controller/postController");
const verifyToken = require("../middleware/verifyToken");

router.route("/post").post(verifyToken, postPost);
router.route("/comment/:postId").post(postComment);
router.route("/like/:postId").post(postLike);
router.route("/updatepost/:id").patch(updatePost);
router.route("/post").get(getPosts);
router.route("/post/:postId").get(getPostById);
router.route("/posts").get(getPostByEmail);
router.route("/post/:id").delete(deletePost);
module.exports = router;
