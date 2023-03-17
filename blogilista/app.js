const { url } = require("./utils/config");
const express = require("express");
const app = express();
const { ErrorHandler, TokenExtractor } = require("./utils/middleware");
const cors = require("cors");
const loginRouter = require("./controllers/login");
require("express-async-errors");
const blogRouter = require("./controllers/blogs");

const mongoose = require("mongoose");

app.use(cors());
app.use(express.json());

mongoose.set("strictQuery", true);
app.use(TokenExtractor);
app.use("/api/blogs", blogRouter);

app.use("/api/users", loginRouter);
app.use(ErrorHandler);
mongoose.connect(url);

module.exports = app;
