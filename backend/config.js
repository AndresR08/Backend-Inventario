// config.js - Centraliza todas las variables de entorno
require("dotenv").config();

module.exports = {
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  refreshSecret: process.env.REFRESH_SECRET,
  port: process.env.PORT || 5000,
};