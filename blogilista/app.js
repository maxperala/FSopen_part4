const { url, PORT } = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const blogRouter = require("./controllers/blogs");

const mongoose = require("mongoose");
const Blog = require("./models/blog");

app.use(cors());
app.use(express.json());

mongoose.set("strictQuery", true);
app.use("/api/blogs", blogRouter);
mongoose.connect(url);

module.exports = app;
