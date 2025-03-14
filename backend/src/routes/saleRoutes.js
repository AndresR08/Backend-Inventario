// ./src/routes/saleRoutes.js
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

    const sales = await Sale.find(filter)
      .populate("product", "name")
      .populate("user", "name")
      .exec();

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: Historial de ventas por usuario (solo admins pueden ver ventas de otros)
router.get("/user/:userId", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId;
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
    const { productId, quantity } = req.body;
    const userId = req.user.id;

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

    // Si el stock cae por debajo del mínimo, se puede notificar
    if (productData.stock < productData.stockMin) {
      console.warn(`Alerta: el producto "${productData.name}" está por debajo del stock mínimo.`);
    }

    res.status(201).json(newSale);
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ message: error.message });
  }
});

// PUT: Editar una venta (solo admins)
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

    // Restaurar stock anterior y actualizar con la nueva cantidad
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

// DELETE: Eliminar una venta (solo admins)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    const productData = await Product.findById(sale.product);
    if (productData) {
      productData.stock += sale.quantity;
      await productData.save();
    }

    await Sale.findByIdAndDelete(req.params.id);
    res.json({ message: "Venta eliminada y stock repuesto" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para obtener estadísticas de ventas
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    // Contar el total de ventas
    const totalSales = await Sale.countDocuments();
    
    // Sumar el total de ingresos de todas las ventas
    const totalIncomeAgg = await Sale.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    
    // Obtener la cantidad total de productos vendidos
    const totalProductsSoldAgg = await Sale.aggregate([
      { $group: { _id: "$product", total: { $sum: "$quantity" } } }
    ]);
    
    // Sumar la cantidad total de productos vendidos
    const totalQuantitySold = totalProductsSoldAgg.reduce((acc, item) => acc + item.total, 0);

    res.json({
      totalSales,
      totalIncome: totalIncomeAgg[0]?.total || 0,
      totalProductsSold: totalQuantitySold
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
