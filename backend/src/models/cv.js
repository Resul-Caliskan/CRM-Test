const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema({
  pdf: {
    type: String,
    required: true,
  },
  companyId: { type: mongoose.Schema.Types.String, ref: "Customer" },
});

module.exports = mongoose.model("Cv", pdfSchema);