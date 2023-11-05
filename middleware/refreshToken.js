const jwt = require("jsonwebtoken");

const jwt_secret =
  "f8b6e4857fa015369fe4512a2d05f73fd297f79884936e93a62e27c36df4e1ec771e04359972304d56438e572b93737d34bb8ba05e80b0cd7ef6b80eb9a4dd2b";

exports.useRefreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  console.log(refreshToken);
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not provided" });
  }

  jwt.verify(refreshToken, jwt_secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign({ email: decoded.email }, jwt_secret, {
      expiresIn: "1d",
    });

    res.json({ accessToken: accessToken });
  });
};
