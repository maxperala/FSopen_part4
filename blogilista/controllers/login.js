const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const loginRouter = express.Router();
const jwt = require("jsonwebtoken");

loginRouter.post("/", async (req, res, next) => {
  const { username, name, password } = req.body;

  if (password.length < 3) {
    return res.status(400).json({ error: "password too short!" });
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });
  try {
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (e) {
    next(e);
  }
});

loginRouter.get("/", async (req, res) => {
  try {
    const users = await User.find({}).populate("blogs", {
      title: 1,
      author: 1,
      url: 1,
      likes: 1,
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

loginRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id).populate("blogs", {
      title: 1,
      author: 1,
      likes: 1,
    });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "user not found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

loginRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);
  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: "invalid username or password",
    });
  }

  const userFromToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userFromToken, process.env.SECRET);

  res.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
