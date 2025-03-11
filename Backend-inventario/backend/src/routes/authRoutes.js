const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// RUTA DE REGISTRO
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        console.log("Registrando usuario:", { name, email, password, role });

        // Verificar si el usuario ya existe
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "El usuario ya existe" });

        // Si no se envía un rol, asignar "user" por defecto
        const newUser = new User({ name, email, password, role: role || "user" });
        await newUser.save();

        res.status(201).json({ message: "Usuario registrado con éxito" });
    } catch (error) {
        console.error("❌ Error registrando usuario:", error);
        res.status(500).json({ message: "Error registrando usuario", error });
    }
});

// RUTA DE LOGIN
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("Datos recibidos en el login:", { email, password });

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log("Usuario no encontrado");
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        console.log("Contraseña ingresada:", password);
        console.log("Hash en la base de datos:", user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("¿Contraseña correcta?", isMatch);

        if (!isMatch) {
            console.log("Contraseña incorrecta");
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }

        console.log("Generando token...");
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        

        console.log("Token generado:", token);

        res.json({ 
            token, 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role // Enviar el rol al frontend
            } 
        });
    } catch (err) {
        console.error("❌ Error en el servidor:", err);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

const { authMiddleware } = require("../middlewares/auth");

router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json(user);
    } catch (error) {
        console.error("❌ Error obteniendo usuario:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});



module.exports = router;
