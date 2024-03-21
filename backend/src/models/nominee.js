const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    email: { type: String, required: true,unique: true },
    phone: { type: String, required: true },
    linkedin: { type: String }
});

const experienceSchema = new mongoose.Schema({
    position: { type: String, required: true },
    company: { type: String, required: true },
    duration: { type: String, required: true },
    description: { type: String }
});

const educationSchema = new mongoose.Schema({
    degree: { type: String, required: true },
    university: { type: String, required: true },
    graduation_year: { type: Number, required: true }
});

const nomineeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    title: { type: String, required: true },
    contact: contactSchema,
    skills: [{ type: String, required: true }],
    experience: [experienceSchema],
    education: [educationSchema]
});

const NomineeModel = mongoose.model('Nominee', nomineeSchema);

module.exports = NomineeModel;