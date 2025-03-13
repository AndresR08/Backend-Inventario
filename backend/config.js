require("dotenv").config();

const config = {
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 5000,
  allowedOrigins: [
    "http://localhost:5173",  // Permitir pruebas en local
    "https://mellifluous-begonia-f48751.netlify.app", // Permitir Netlify
  ],
};

module.exports = config;
