require("dotenv").config();

const url = process.env.MONGODB_URI;
const PORT = process.env.PORT;
module.exports = { url, PORT };
