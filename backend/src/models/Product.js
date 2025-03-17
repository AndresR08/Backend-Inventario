// models/Product.js - Modelo de Producto mejorado
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  stockMin: { type: Number, default: 5 },
  stockMax: { type: Number, default: 100 },
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);
