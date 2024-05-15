const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  state: { type: Boolean, required: true },
  url: { type: String, required: true },
  type: { type: String, required: true },
  message: {
    tr_message: { type: String, required: true },
    en_message: { type: String, required: true }
  },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  positionId: { type: mongoose.Schema.Types.ObjectId, ref: "Position" },
  nomineeId: { type: mongoose.Schema.Types.ObjectId, ref: "Nominee" },
  receiverCompanyId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" }
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;