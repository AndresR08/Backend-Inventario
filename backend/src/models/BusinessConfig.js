const mongoose = require("mongoose");

const BusinessConfigSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  attributes: [{ name: String, type: String }], // Ejemplo: [{ name: "Talla", type: "string" }]
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("BusinessConfig", BusinessConfigSchema);

