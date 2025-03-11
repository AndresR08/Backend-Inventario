const express = require("express");
const router = express.Router();
const Sale = require("../models/Sale");
const Product = require("../models/Product");

// GET: Obtener todas las ventas
router.get("/", async (req, res) => {
  try {
    // Populate para ver datos del producto
    const sales = await Sale.find().populate("product");
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Crear una venta
router.post("/", async (req, res) => {
  try {
    const { product, quantity } = req.body;

    // Verifica que existan los campos
    if (!product || !quantity) {
      return res.status(400).json({ error: "Faltan campos" });
    }

    // Busca el producto para calcular total
    const productData = await Product.findById(product);
    if (!productData) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const total = productData.price * quantity;

    // Crea la venta
    const newSale = new Sale({ product, quantity, total });
    await newSale.save();

    // (Opcional) Disminuir stock del producto
    productData.stock -= quantity;
    await productData.save();

    res.status(201).json(newSale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT: Editar una venta (opcional, en muchos sistemas no se edita una venta)
router.put("/:id", async (req, res) => {
  try {
    const { product, quantity, total } = req.body;
    const updatedSale = await Sale.findByIdAndUpdate(
      req.params.id,
      { product, quantity, total },
      { new: true }
    );
    res.json(updatedSale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE: Eliminar una venta
router.delete("/:id", async (req, res) => {
  try {
    await Sale.findByIdAndDelete(req.params.id);
    res.json({ message: "Venta eliminada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
