const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const jwtCheck = async (token) => {
  //console.log("JWT CHECK RUNNING...");
  const decodedToken = jwt.verify(token, process.env.SECRET);

  const user = await User.findById(decodedToken.id);

  return user;
};

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  //console.log("before return: ", blogs);
  response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
  if (!request.token)
    return response.status(401).json({ error: "Unauthorized" });
  const blog = new Blog(request.body);

  //console.log(request.body);

  const user = await jwtCheck(request.token);
  // console.log("USER AFTER RETURN: ", user);

  if (user) {
    blog.user = user._id;
    //console.log("USER ID", user.id);
    //console.log("USER _ID: ", user._id);
    const result = await blog.save();
    user.blogs = user.blogs.concat(blog.id);
    await user.save();
    response.status(201).json(result);
  } else {
    response.status(404).json({ error: "User not found" });
  }
});

blogRouter.delete("/:id", async (request, res) => {
  if (!request.token) return res.status(401).json({ error: "unauthorized" });

  const user = await jwtCheck(request.token);

  const id = request.params.id;
  blogToDelete = await Blog.findById(id).populate("user", {
    username: 1,
    name: 1,
  });
  // console.log("blogToDELETE:", blogToDelete);
  // console.log("USER TO COMPARE:", user);
  if (blogToDelete.user._id.toString() === user._id.toString()) {
    result = await blogToDelete.remove();
    res.json(result);
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

blogRouter.patch("/:id", async (req, res) => {
  // currently, modifying a blog does not require a token (!optimal)
  const id = req.params.id;
  blogToEdit = await Blog.findById(id);
  if (req.body.likes !== blogToEdit.likes) {
    blogToEdit.likes = req.body.likes;
  }
  const result = await blogToEdit.save();
  res.json(result);
});

module.exports = blogRouter;
