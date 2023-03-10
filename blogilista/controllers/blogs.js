const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get("/", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

blogRouter.post("/", (request, response) => {
  console.log(request);
  const blog = new Blog(request.body);
  console.log(request.body);
  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

module.exports = blogRouter;
