const mongoose = require('mongoose');

const demandSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    number: {type: String,required:true,unique:true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    companyId: {type:String, required:true},
    companyname: { type: mongoose.Schema.Types.String, ref: 'Customer'}
});

const Demand = mongoose.model('Demand', demandSchema);

module.exports = Demand;