const express = require("express");
const app = express();
const port = process.env.Port || 5000;
const cors = require("cors");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");
const User = require("./models/userModel");

const useRoute = require("./route/userRoute");
const postRoute = require("./route/postRoute");

// middlewere

app.use(cors());
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

const uri =
  "mongodb+srv://socialmate:4en8zEW1GBgyu4E6@cluster0.ddhlldi.mongodb.net/social-mate?retryWrites=true&w=majority";

// mongodb connected
mongoose
  .connect(uri, {
    useNewUrlParser: true,
  })
  .then(() => console.log("connected to database"))
  .catch((e) => console.error(e));

app.use("/", postRoute);
app.use("/user", useRoute);

// forget password
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const oldUser = await User.findOne({ email });

  if (!oldUser) {
    return res.send({ status: "User doesnot exist" });
  }
  const secret = jwt_secret + oldUser.password;

  const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret);
  const link = `https://socialmate-server.vercel.app/reset-password/${oldUser._id}/${token}`;
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "safemahmud987@gmail.com",
      pass: "sqwpsqhyqbbhrnly",
    },
  });

  var mailOptions = {
    from: "safemahmud987@gmail.com",
    to: email,
    subject: "password-reset",
    text:
      "coppy the link and go for reset password :" + "  " + "  " + "  " + link,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return res.send({ status: "Authentication problem try after some time" });
    } else {
      console.log("Email sent: " + info.response);
      return res.send({ status: `password reset email sent to ${email}` });
    }
  });
});

app.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const olduser = await User.findOne({ _id: id });
  if (!olduser) {
    return res.send({ status: "user doesnot exist" });
  }
  console.log(olduser);
  const secret = jwt_secret + olduser.password;
  try {
    const verify = jwt.verify(token, secret);

    return res.render("app", { email: verify.email, status: "not verified" });
  } catch (error) {
    return res.send({ status: "not verifed or time expires" });
  }
});
app.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  const { confirmpassword } = req.body;
  const olduser = await User.findOne({ _id: id });

  console.log(password, confirmpassword);
  const secret = jwt_secret + olduser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encriptedpassword = await bcrypt.hash(password, 10);
    if (verify) {
      const result = await User.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            password: encriptedpassword,
          },
        }
      );
      res.render("app", { email: verify.email, status: "verified" });
    }
  } catch (error) {
    return res.send({ status: "not verifed or time expires" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
