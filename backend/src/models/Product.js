const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: "BusinessConfig", required: true },
  attributes: { type: Map, of: String }, // Ejemplo: { "Talla": "M", "Color": "Azul" }
  image: { type: String } // URL de la imagen del producto
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);

