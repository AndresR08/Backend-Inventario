const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth");

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos", error });
  }
});

// Crear un producto (solo admin)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: "Error al crear producto", error });
  }
});

// Editar un producto (solo admin)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar producto", error });
  }
});

// Eliminar un producto (solo admin)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar producto", error });
  }
});

module.exports = router;

