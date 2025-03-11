const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Sale = require("../models/Sale");
const Product = require("../models/Product");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth");

// GET: Obtener todas las ventas (si es admin, todas; si es usuario, solo las suyas)
router.get("/", authMiddleware, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== "admin") {
      filter.user = req.user.id;
    }

    const sales = await Sale.find(filter).populate("product").populate("user", "name email");
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: Historial de ventas por usuario específico (Solo admins pueden ver ventas de otros)
router.get("/user/:userId", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Si no es admin, solo puede ver su propio historial
    if (req.user.role !== "admin" && req.user.id !== userId) {
      return res.status(403).json({ error: "No tienes permiso para ver estas ventas" });
    }

    const sales = await Sale.find({ user: userId }).populate("product");
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Crear una venta (Guarda el usuario que la hizo)
router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("Body recibido:", req.body);
    const { productId, quantity } = req.body;
    const userId = req.user.id; // Tomamos el usuario desde el token

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "ID de producto inválido" });
    }

    if (!productId || !quantity) {
      return res.status(400).json({ error: "Faltan campos" });
    }

    const productData = await Product.findById(productId);
    if (!productData) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    if (productData.stock < quantity) {
      return res.status(400).json({ error: "Stock insuficiente" });
    }

    const total = productData.price * quantity;
    const newSale = new Sale({ product: productId, quantity, total, user: userId });

    await newSale.save();
    productData.stock -= quantity;
    await productData.save();

    res.status(201).json(newSale);
  } catch (error) {
    console.error("🔥 Error en el servidor:", error);
    res.status(500).json({ message: error.message });
  }
});

// PUT: Editar una venta (Solo admins)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    const { quantity } = req.body;
    if (!quantity) {
      return res.status(400).json({ error: "Cantidad requerida" });
    }

    const productData = await Product.findById(sale.product);
    if (!productData) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Restaurar stock anterior y descontar el nuevo
    productData.stock += sale.quantity;
    if (productData.stock < quantity) {
      return res.status(400).json({ error: "Stock insuficiente" });
    }

    productData.stock -= quantity;
    await productData.save();

    sale.quantity = quantity;
    sale.total = productData.price * quantity;
    await sale.save();

    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE: Eliminar una venta (Solo admins)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    const productData = await Product.findById(sale.product);
    if (productData) {
      productData.stock += sale.quantity; // Reponer stock
      await productData.save();
    }

    await Sale.findByIdAndDelete(req.params.id);
    res.json({ message: "Venta eliminada y stock repuesto" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

