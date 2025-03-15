require("dotenv").config({ path: __dirname + "/../.env" });
console.log("MONGO_URI =", process.env.MONGO_URI);
console.log("PORT =", process.env.PORT);

const config = {
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 5050,
  allowedOrigins: [
    "http://localhost:5173",
    "https://mellifluous-begonia-f48751.netlify.app",
  ],
};

module.exports = config;
