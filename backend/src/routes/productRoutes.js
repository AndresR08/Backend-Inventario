// productRoutes.js - Rutas de productos optimizadas
const express = require("express");
const { check } = require("express-validator");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth");
const { createProduct, getProducts, updateProduct, deleteProduct } = require("../controllers/productController");

const router = express.Router();

router.get("/", getProducts);
router.post("/", authMiddleware, adminMiddleware, [
  check("name").notEmpty(),
  check("price").isNumeric(),
  check("stock").isInt(),
], createProduct);
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
