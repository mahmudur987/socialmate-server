const express = require("express");
const router = express.Router();
const {
  registerUser,
  logInUser,
  getuserData,
} = require("../controller/userController");
const verifyToken = require("../middleware/verifyToken");
const { useRefreshToken } = require("../middleware/refreshToken");
router.route("/register").post(registerUser);
router.route("/login-user").post(logInUser);
router.route("/userData").post(verifyToken, getuserData);
router.route("/refresh-token").post(useRefreshToken);

module.exports = router;
