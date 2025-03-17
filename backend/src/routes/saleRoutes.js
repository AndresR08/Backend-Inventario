// saleRoutes.js - Rutas de ventas optimizadas
const saleRoutes = require("express").Router();
const { authMiddleware } = require("../middlewares/auth");
const { createSale, getSales } = require("../controllers/saleController");

saleRoutes.get("/", authMiddleware, getSales);
saleRoutes.post("/", authMiddleware, createSale);

module.exports = saleRoutes;
