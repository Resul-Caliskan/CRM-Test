const mongoose = require("mongoose");

const parameterSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  values: [{ type: String, required: true, unique: true }],
});

const Parameter = mongoose.model("Parameter", parameterSchema);

module.exports = Parameter;