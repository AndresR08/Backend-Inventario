const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  stockMin: { type: Number, default: 0 },  // Stock mínimo
  stockMax: { type: Number, default: 0 },  // Stock máximo (opcional)
  category: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
