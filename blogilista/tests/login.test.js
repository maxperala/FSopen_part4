const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");
let test_token = "";
const initial = [
  {
    title: "testi1",
    author: "testi1",
    url: "http://test.com",
    likes: 1,
  },
  {
    title: "testi12",
    author: "testi12",
    url: "https:////faultyurl.net////",
    likes: 1,
  },
];

beforeAll(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});

  const posting = await api
    .post("/api/users")
    .send({
      username: "testi1",
      name: "testi",
      password: "testipassword",
    })
    .set("Content-Type", "application/json");

  const login = await api
    .post("/api/users/login")
    .send({
      username: "testi1",
      password: "testipassword",
    })
    .set("Content-Type", "application/json");
  //console.log("LOGIN:", login);
  test_token = login.body.token;
  test_user_id = posting.body.id;
});

describe("Tests for login and token stuff", () => {
  test("See if token is present and initial login has succeeded", () => {
    console.log("TEST TOKEN:", test_token);
    expect(test_token).toBeTruthy();
  });
  test("Add a blog", async () => {
    const payload = initial[0];
    const response = await api
      .post("/api/blogs")
      .send(payload)
      .set("Content-Type", "application/json")
      .set("authorization", `Bearer ${test_token}`);
    //console.log("RESPONSE:", response);
    expect(response.body.title).toBe("testi1");
  });
  test("Test that user is attached to added blog", async () => {
    const blogs = await api.get("/api/blogs").send({});
    //console.log("BLOGS:", blogs);
    expect(blogs.body[0].user.username).toBe("testi1");
  });
  test("Test that blogs are attached to user", async () => {
    const res = await api.get(`/api/users/${test_user_id}`);
    //console.log("USER:", res);
    expect(res.body.blogs[0].title).toBe("testi1");
  });
  test("Removal of blog with wrong TOKEN", async () => {
    const blogs = await Blog.find({});
    console.log("BLOGS", blogs);
    const blogToDeleteID = blogs[0]._id;
    const fakeToken = test_token.replace("w", "o");

    //console.log("REAL TOKEN:", test_token);
    //console.log("FAKE TOKEN:", fakeToken);
    const res = await api
      .delete(`/api/blogs/${blogToDeleteID}`)
      .set("authorization", `Bearer ${fakeToken}`);
    console.log("ERROR:", res.body.error);
    expect(res.body.error).toBeTruthy();
  });
  test("Removal of blog with right TOKEN", async () => {
    const blogs = await Blog.find({});
    console.log("BLOGS", blogs);
    const blogToDeleteID = blogs[0]._id;
    console.log("BLOG TO DELETE", blogToDeleteID);
    // const string = `/api/blogs/${blogToDeleteID}`;
    // console.log(string);
    const res = await api
      .delete(`/api/blogs/${blogToDeleteID}`)
      .set("authorization", `Bearer ${test_token}`);
    //console.log("resPONSE:", res);
    expect(res.body.id.toString()).toBe(blogs[0]._id.toString());
  });
});

describe("replacement tests for broken ones", () => {
  beforeEach(async () => {
    const payload = initial[0];
    const response = await api
      .post("/api/blogs")
      .send(payload)
      .set("Content-Type", "application/json")
      .set("authorization", `Bearer ${test_token}`);
    //console.log(response);
  });

  test("getting all blogs", async () => {
    const result = await api.get("/api/blogs");
    //const blogs = await Blog.find({});
    //console.log(blogs);
    //console.log("RESULTT:", result.body);
    expect(result.body).toHaveLength(1);
  });
  test("check field id", async () => {
    const result = await api.get("/api/blogs");
    expect(result.body[0].id).toBeDefined();
  });
  test("if LIKES is auto set to zero", async () => {
    const payload = {
      title: "jesjes12",
      author: "testauthor",
      url: "http:/dummy.dummy/",
    };
    const response = await api
      .post("/api/blogs")
      .send(payload)
      .set("Content-Type", "application/json")
      .set("authorization", `Bearer ${test_token}`);
    //console.log("RESPONSE BODY: ", response);
    const blog = await Blog.findById(response.body.id);
    console.log("BLOG", blog);
    expect(blog.likes).toBe(0);
  });
  test("adding blog without required fields", async () => {
    const payload = { author: "jaaaaaaaaahas", likes: 5 };

    const response = await api
      .post("/api/blogs")
      .send(payload)
      .set("Content-Type", "application/json")
      .set("authorization", `Bearer ${test_token}`);
    //console.log(response.status);
    expect(response.status).toBe(400);
  });
  test("modifying blog", async () => {
    // Currently, modifying a blog does not require a token (not optimal)
    const blogs = await Blog.find({});
    const blogID = blogs[0].id;
    await api.patch(`/api/blogs/${blogID}`).send({ likes: 99 });
    const modiblog = await Blog.findById(blogs[0].id);
    expect(modiblog.likes).toBe(99);
  });
});
