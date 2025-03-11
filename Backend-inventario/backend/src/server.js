require("dotenv").config({ path: "./.env" });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const saleRoutes = require("./routes/saleRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");



const app = express(); // Asegúrate de inicializar 'app' antes de usarlo

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Servidor corriendo correctamente...");
});

// Verificar que MONGO_URI está definido
if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI no está definido en el archivo .env");
    process.exit(1);
}

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Conectado a MongoDB"))
    .catch(err => {
        console.error("❌ Error conectando a MongoDB:", err);
        process.exit(1);
    });

// 📌 Rutas (deben ir después de inicializar 'app')
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/users", userRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));
