const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");
    
    // Verificar si existe el encabezado Authorization y si está bien formateado
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Acceso denegado. Token no proporcionado o mal formateado." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        // Verifica si el token tiene los datos esperados
        if (!verified.id || !verified.role) {
            return res.status(400).json({ message: "Token mal formado." });
        }

        req.user = { id: verified.id, role: verified.role }; 
        next();
    } catch (error) {
        // Manejo de errores más específico
        console.error("Error al verificar token:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(403).json({ message: "Token expirado. Por favor, inicia sesión nuevamente." });
        }

        return res.status(403).json({ message: "Token inválido." });
    }
};

// Middleware para verificar que el usuario es admin
const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({ message: "No tienes permisos para realizar esta acción." });
    }
};

module.exports = { authMiddleware, adminMiddleware };
