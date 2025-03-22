const BusinessConfig = require("../models/BusinessConfig");

// Crear o actualizar configuración del negocio
const upsertBusinessConfig = async (req, res) => {
  try {
    const { businessName, attributes } = req.body;
    const userId = req.user.id; // Asumimos que el usuario está autenticado

    const config = await BusinessConfig.findOneAndUpdate(
      { createdBy: userId },
      { businessName, attributes, createdBy: userId },
      { new: true, upsert: true } // Crea si no existe
    );

    res.json(config);
  } catch (error) {
    res.status(500).json({ message: "Error guardando configuración", error });
  }
};

// Obtener la configuración del negocio
const getBusinessConfig = async (req, res) => {
  try {
    const config = await BusinessConfig.findOne({ createdBy: req.user.id });
    if (!config) return res.status(404).json({ message: "Configuración no encontrada" });
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo configuración", error });
  }
};

module.exports = { upsertBusinessConfig, getBusinessConfig };

