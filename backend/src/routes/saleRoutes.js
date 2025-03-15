// backend/src/routes/saleRoutes.js
const express = require("express");
const { createSale } = require("../controllers/saleController");
const Sale = require("../models/Sale"); 
const { authMiddleware } = require("../middlewares/auth");

const router = express.Router();

// Ruta de prueba
router.get("/prueba", (req, res) => {
  console.log("✅ saleRoutes.js cargado correctamente");
  res.json({ mensaje: "Prueba OK" });
});

// Ruta para obtener estadísticas 
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    // Obtener total de ventas
    const totalSales = await Sale.countDocuments();

    // Obtener todas las ventas para calcular ingresos y cantidad de productos vendidos
    const salesData = await Sale.find();
    const totalIncome = salesData.reduce((acc, sale) => acc + sale.total, 0);
    const totalProductsSold = salesData.reduce((acc, sale) => acc + sale.quantity, 0);

    res.json({ totalSales, totalIncome, totalProductsSold });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

// Nueva ruta para crear una venta
router.post("/", authMiddleware, createSale);


console.log("✅ saleRoutes.js cargado correctamente");

module.exports = router;
