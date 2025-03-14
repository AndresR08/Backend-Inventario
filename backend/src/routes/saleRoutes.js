// ./src/routes/saleRoutes.js
const express = require("express");
const router = express.Router();

// Ruta de prueba simple (sin autenticación) para confirmar carga de rutas
router.get("/prueba", (req, res) => {
  console.log("✅ saleRoutes.js cargado correctamente");
  res.json({ mensaje: "Prueba OK" });
});

// Ruta mínima para /stats
router.get("/stats", (req, res) => {
  res.json({ totalSales: 5, totalIncome: 1000, totalProductsSold: 10 });
});

console.log("📌 Rutas en saleRoutes:", router.stack.map(layer => layer.route && layer.route.path).filter(Boolean));

module.exports = router;
