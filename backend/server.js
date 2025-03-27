// server.js - Configuración del servidor principal
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const config = require("./config");

// Importar rutas
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const productRoutes = require("./src/routes/productRoutes");
const saleRoutes = require("./src/routes/saleRoutes");
const businessConfigRoutes = require("./src/routes/businessConfigRoutes");

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Conectar a MongoDB
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB conectado"))
.catch((err) => console.error("❌ Error en MongoDB:", err));

// Definir rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/business-config", businessConfigRoutes);

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error("❌ Error global:", err);
  res.status(500).json({ message: "Error interno del servidor" });
});

// Iniciar servidor
app.listen(config.port, () => console.log(`🚀 Servidor en puerto ${config.port}`));

