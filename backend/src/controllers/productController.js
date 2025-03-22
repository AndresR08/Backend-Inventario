const Product = require("../models/Product");
const BusinessConfig = require("../models/BusinessConfig");
const { validationResult } = require("express-validator");

// Crear producto con atributos dinámicos
const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { name, description, price, stock, category, attributes, image } = req.body;
    const userId = req.user.id;

    // Obtener la configuración del negocio
    const businessConfig = await BusinessConfig.findOne({ createdBy: userId });
    if (!businessConfig) return res.status(400).json({ message: "Configuración de negocio no encontrada" });

    const newProduct = new Product({
      name, description, price, stock, category, attributes, image,
      businessId: businessConfig._id,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Error al crear producto", error });
  }
};

// Obtener productos según el negocio
const getProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    const businessConfig = await BusinessConfig.findOne({ createdBy: userId });

    if (!businessConfig) return res.status(400).json({ message: "Configuración de negocio no encontrada" });

    const products = await Product.find({ businessId: businessConfig._id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos", error });
  }
};

// Actualizar producto
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar producto", error });
  }
};

// Eliminar producto
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar producto", error });
  }
};

module.exports = { createProduct, getProducts, updateProduct, deleteProduct };

