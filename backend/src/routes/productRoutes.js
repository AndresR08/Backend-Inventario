// ./src/routes/productRoutes.js
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
    const { name, price, stock, category, stockMin, stockMax } = req.body;

    if (!name || !price || stock === undefined || !category) {
      return res.status(400).json({ error: "Faltan campos" });
    }

    const newProduct = new Product({ name, price, stock, category, stockMin, stockMax });
    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

// Obtener productos con bajo stock
router.get("/low-stock", authMiddleware, async (req, res) => {
  try {
    // Compara el stock actual con el stock mínimo
    const lowStockProducts = await Product.find({ $expr: { $lt: ["$stock", "$stockMin"] } });
    res.json(lowStockProducts);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos con bajo stock", error });
  }
});

module.exports = router;
