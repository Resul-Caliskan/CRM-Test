const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema({
  department: { type: String, required: true },
  jobtitle: { type: String, required: true },
  experienceperiod: { type: String, required: true }, 
  modeofoperation: { type: String, required: true },
  description: { type: String, required: true },
  worktype: { type: String, required: true },
  skills:[{ type: String, required: true },],
  positionCountry:{ type: String, required: true },
  positionCity: { type: String, required: true },
  positionCounty: { type: String, required: true },
  positionAdress:{ type: String, required: true },
  bannedCompanies:[{ type: String},],
  preferredCompanies:[{type:String}],
  industry:[{type:String}],
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  companyName: { type: mongoose.Schema.Types.String, ref: "Customer" },
  sharedNominees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Nominee" }],
  dateOfStart: { type: String, required: true },
  requestedNominees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Nominee"}],

});

module.exports = mongoose.model("Position", positionSchema);
