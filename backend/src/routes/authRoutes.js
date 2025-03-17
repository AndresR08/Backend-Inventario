const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authMiddleware } = require("../middlewares/auth");
const rateLimit = require("express-rate-limit");

// ✅ Límite de intentos de login para evitar fuerza bruta
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Máximo 5 intentos
    message: "Demasiados intentos de inicio de sesión. Intenta de nuevo más tarde."
});

// ✅ Generar tokens de acceso y refresh
const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "15m" } // Acceso válido por 15 minutos
    );

    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_SECRET,
        { expiresIn: "7d" } // Refresh token válido por 7 días
    );

    return { accessToken, refreshToken };
};

// ✅ RUTA DE REGISTRO
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Verificar si el usuario ya existe
        if (await User.findOne({ email })) {
            return res.status(400).json({ message: "El usuario ya existe" });
        }

        // ❌ No permitir que los usuarios elijan su rol (solo "user" por defecto)
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role: "user" });
        await newUser.save();

        res.status(201).json({ message: "Usuario registrado con éxito" });
    } catch (error) {
        console.error("❌ Error registrando usuario:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// ✅ RUTA DE LOGIN (con rate limiting)
router.post("/login", loginLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

        // Generar tokens
        const { accessToken, refreshToken } = generateTokens(user);

        // Enviar refresh token en una cookie segura
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
        });

        res.json({ accessToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error("❌ Error en el servidor:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// ✅ RUTA PARA OBTENER NUEVO ACCESS TOKEN
router.post("/refresh", (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(403).json({ message: "No hay token de sesión" });

    jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (err, decoded) => {
        if (err) return res.status(403).json({ message: "Token inválido" });

        const user = await User.findById(decoded.id);
        if (!user) return res.status(403).json({ message: "Usuario no encontrado" });

        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

        // Actualizar refresh token
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ accessToken });
    });
});

// ✅ RUTA PARA OBTENER DATOS DEL USUARIO
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
        res.json(user);
    } catch (error) {
        console.error("❌ Error obteniendo usuario:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// ✅ RUTA PARA CERRAR SESIÓN (Eliminar refresh token)
router.post("/logout", (req, res) => {
    res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "Strict" });
    res.json({ message: "Sesión cerrada exitosamente" });
});

module.exports = router;
