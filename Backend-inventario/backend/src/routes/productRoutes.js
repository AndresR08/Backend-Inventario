const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth");

// ✅ GET – Obtener todos los productos (solo autenticados)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ POST – Agregar un nuevo producto (solo admin)
router.post("/", async (req, res) => {
  try {
      console.log("Datos recibidos en el backend:", req.body); // 👀 Verifica si llega category

      const { name, price, stock, category } = req.body;

      if (!name || !price || !stock || !category) {
          return res.status(400).json({ message: "Todos los campos son obligatorios" });
      }

      const newProduct = new Product({ name, price, stock, category });
      await newProduct.save();

      res.status(201).json({ message: "Producto creado", product: newProduct });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al crear el producto" });
  }
});


// ✅ PUT – Editar un producto (solo admin)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, price, stock, category } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, stock, category },
      { new: true }
    );
    res.json({ message: "Producto actualizado", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ DELETE – Eliminar un producto (solo admin)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
