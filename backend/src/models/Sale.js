const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Sale", saleSchema);
