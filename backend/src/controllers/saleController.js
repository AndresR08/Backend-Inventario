// backend/src/controllers/saleController.js
const Sale = require("../models/Sale");
const Product = require("../models/Product");

const createSale = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validar que se reciben los campos necesarios
    if (!productId || !quantity) {
      return res.status(400).json({ message: "Faltan datos: productId y quantity son requeridos." });
    }

    // Buscar el producto
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    // Calcular total y validar stock
    const total = product.price * quantity;
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Stock insuficiente para realizar la venta." });
    }

    // Actualizar stock del producto
    product.stock -= quantity;
    await product.save();

    // Crear la venta (asumiendo que req.user viene del authMiddleware)
    const sale = new Sale({
      product: productId,
      quantity,
      total,
      user: req.user.id,
    });
    await sale.save();

    res.status(201).json({ message: "Venta registrada con éxito.", sale });
  } catch (error) {
    console.error("Error al registrar la venta:", error);
    res.status(500).json({ message: "Error en el servidor al registrar la venta.", error });
  }
};

module.exports = { createSale };
