const jwt = require("jsonwebtoken");

const ErrorHandler = (error, request, response, next) => {
  // console.log("ERROR HANDLER RUNNING");
  if (error.name === "ValidationError") {
    return response.status(400).json({
      error: "Username in use or less than 3 characters long",
    });
  }

  console.log(error.message);
  response.status(500).json({ error: error.message });
};

const TokenExtractor = (request, response, next) => {
  const authorizz = request.get("authorization");
  //console.log("TOKEN EXTRACTOR: ", authorizz);
  if (authorizz && authorizz.startsWith("Bearer ")) {
    request.token = authorizz.replace("Bearer ", "");
  }
  next();
};

module.exports = { ErrorHandler, TokenExtractor };
