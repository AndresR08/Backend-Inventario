const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const productRoutes = require("./src/routes/productRoutes");
const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");
const saleRoutes = require("./src/routes/saleRoutes");

dotenv.config(); // Cargar variables de entorno antes de usarlas

const app = express();

// Configuración de CORS correcta
const corsOptions = {
  origin: "https://mellifluous-begonia-f48751.netlify.app", // URL de tu frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Permitir cookies y headers de autenticación
};

app.use(cors(corsOptions)); // Usamos SOLO estas opciones de CORS

app.use(express.json()); // Para parsear el cuerpo de las solicitudes

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
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
app.use("/api/sales", saleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Configurar el puerto de la aplicación
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});

