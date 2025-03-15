// Importaciones principales
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const config = require("./config");  

// Importar rutas
const productRoutes = require("./src/routes/productRoutes");
const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");
const saleRoutes = require("./src/routes/saleRoutes"); // 📌 Asegurar que está aquí

dotenv.config();  
const app = express();

console.log("🚀 Iniciando servidor...");

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(config.mongoURI)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => {
    console.error("❌ Error conectando a MongoDB:", err);
    process.exit(1);
  });

// 🔥 LOG de carga de rutas
console.log("🔄 Cargando rutas...");

// Rutas
app.use("/api/products", productRoutes);
console.log("📌 Rutas de productos cargadas");

app.use("/api/sales", saleRoutes);
console.log("📌 Rutas de ventas cargadas");

app.use("/api/users", userRoutes);
console.log("📌 Rutas de usuarios cargadas");

app.use("/api/auth", authRoutes);
console.log("📌 Rutas de autenticación cargadas");

// 🚀 Ver todas las rutas activas
console.log("📌 Rutas activas en Express:");
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`➡️ ${Object.keys(r.route.methods).join(", ").toUpperCase()} ${r.route.path}`);
  }
});

// Iniciar el servidor
const PORT = config.port;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
