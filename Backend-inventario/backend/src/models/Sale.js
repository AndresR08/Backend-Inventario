const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Relaciona la venta con un producto
    required: true
  },
  quantity: { type: Number, required: true }, // Cantidad vendida
  total: { type: Number, required: true },    // Precio total de la venta
  date: { type: Date, default: Date.now }     // Fecha de la venta
});

module.exports = mongoose.model("Sale", saleSchema);
