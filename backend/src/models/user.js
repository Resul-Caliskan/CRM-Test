const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, required:true, ref: 'Customers' },
  role: { type: mongoose.Schema.Types.String, required:true, ref: 'Role' },
  phone: {type: String , required:true , unique:true},
});

const User = mongoose.model('User', userSchema);

module.exports = User;