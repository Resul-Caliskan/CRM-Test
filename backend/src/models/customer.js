const mongoose = require("mongoose");


const customerSchema = new mongoose.Schema({
  
  companyname: { type: String, required: true, unique: true },
  companytype: { type: String, required: true },
  companysector: { type: String, required: true },
  companyadress: { type: String, required: true },
  companycity: { type: String, required: true },
  companycountry: { type: String, required: true },
  companycounty: { type: String, required: true },
  companyweb: { type: String, required: true },
  contactname: { type: String, required: true },
  contactmail: { type: String, required: true },
  contactnumber: { type: String, required: true },
  industries: [{type: String}],
  users: [{ type: mongoose.Schema.Types.String, ref: "User" }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Nominee" }],
  notificationId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }],
});

module.exports = mongoose.model("Customer", customerSchema);
