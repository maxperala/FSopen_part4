const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Blog = require("./blog");
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  name: String,
  passwordHash: String,
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
});

userSchema.set("toJSON", {
  transform: (document, returned) => {
    (returned.id = returned._id.toString()), delete returned._id;
    delete returned.__v;
    delete returned.passwordHash;
  },
});
userSchema.plugin(uniqueValidator);
const User = mongoose.model("User", userSchema);

module.exports = User;
