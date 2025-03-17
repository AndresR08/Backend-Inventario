// models/Sale.js - Modelo de Venta mejorado
const SaleSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quantity: { type: Number, required: true, min: 1 },
  total: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Sale", SaleSchema);