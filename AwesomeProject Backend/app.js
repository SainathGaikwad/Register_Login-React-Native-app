const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const mongoUrl =
  "mongodb+srv://gaikwadsainath738:admin@cluster0.r0it8f0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const JWT_SECRET = "sdtcfyvgbjnk423012345!@#$%^&*";

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("MongoDB database connected");
  })
  .catch((e) => {
    console.log("Error in connecting to MongoDB", e);
  });

require("./UserDetails");
const User = mongoose.model("UserInfo");

app.get("/", (req, res) => {
  res.send({ status: "started" });
});

app.post("/register", async (req, res) => {
  const { name, email, mobile, password } = req.body;

  const oldUser = await User.findOne({ email: email });

  const encryptedPassword = await bcrypt.hash(password, 10);

  if (oldUser) {
    return res.send({ data: "user already exists!!!" });
  }

  try {
    await User.create({
      name: name,
      email: email,
      mobile,
      password: encryptedPassword,
    });
    res.send({ status: "ok", data: "user created successfully" });
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});

app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  const oldUser = await User.findOne({ email: email });

  if (!oldUser) {
    return res.send({ data: "user doesn't exist!!!" });
  }
  if (await bcrypt.compare(password, oldUser.password)) {
    const token = jwt.sign({ email: oldUser.email }, JWT_SECRET);
    // console.log(token);
    if (res.status(201)) {
      return res.send({
        status: "ok",
        data: token,
        // userType: oldUser.userType,
      });
    } else {
      return res.send({ error: "error" });
    }
  }
});

app.listen(5001, () => {
  console.log("Node js server started");
});
