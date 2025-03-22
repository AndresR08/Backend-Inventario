// backend/src/middlewares/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token || req.header("Authorization")?.split(" ")[1];
    console.log("Token recibido:", token);
    if (!token) return res.status(401).json({ message: "Acceso denegado. Token no proporcionado." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        return res.status(403).json({ message: "Token inválido o expirado." });
    }
};

module.exports = { authMiddleware };
