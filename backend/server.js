const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const productRoutes = require("./src/routes/productRoutes");
const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");
const saleRoutes = require("./src/routes/saleRoutes");
const config = require("./config");  

dotenv.config(); // Cargar variables de entorno antes de usarlas

const app = express();

const allowedOrigins = config.allowedOrigins;  // Usamos las origins definidas en config.js

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
}));

// Middleware para configurar manualmente los headers de CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// Middleware para forzar HTTPS en producción
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.headers["x-forwarded-proto"] !== "https") {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

app.use(express.json()); // Para parsear el cuerpo de las solicitudes

// Conectar a MongoDB
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => {
    console.error("❌ Error conectando a MongoDB:", err);
    process.exit(1); // Detener la app si la DB no se conecta
  });

// Rutas
app.use("/api/products", productRoutes);
console.log("🔄 Cargando rutas de ventas...");
app.use("/api/sales", saleRoutes);
console.log("🔄 Cargando rutas de ventas...");
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);


// Configurar el puerto de la aplicación
const PORT = config.port;
console.log("📌 Rutas cargadas en Express:");
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`➡️ ${Object.keys(r.route.methods).join(", ").toUpperCase()} ${r.route.path}`);
  }
});


app._router.stack.forEach((route) => {
  if (route.route && route.route.path) {
    console.log("📌 Ruta activa:", route.route.path);
  }
});


app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});


