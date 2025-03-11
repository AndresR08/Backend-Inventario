const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");
    console.log("Authorization Header:", authHeader); // Agrega esto

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Acceso denegado. Token no proporcionado o mal formateado." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: verified.id, role: verified.role }; 
        console.log("Token verificado:", req.user); // Agrega esto
        next();
    } catch (error) {
        console.error("Error al verificar token:", error); // Agrega esto
        if (error.name === "TokenExpiredError") {
            return res.status(403).json({ message: "Token expirado. Por favor, inicia sesión nuevamente." });
        }

        res.status(403).json({ message: "Token inválido." });
    }
};


// Middleware para verificar que el usuario es admin
const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        console.log("Usuario autenticado:", req.user);
        next();
    } else {
        return res.status(403).json({ message: "No tienes permisos para realizar esta acción." });
    }
};

module.exports = { authMiddleware, adminMiddleware };
