const Demand = require("../models/demand");

exports.addDemand = async (req, res) => {
    try {
        const newDemand = new Demand({
            name: req.body.name,
            surname: req.body.surname,
            number: req.body.number,
            email: req.body.email,
            password: "venhancersifre",
            companyname: req.body.companyname,
            companyId: req.body.companyId,
        });
        

        await newDemand.save();
        res.status(201).json({ message: 'Talep başarıyla eklendi.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.getAllDemands = async (req, res) => {
    try {
        const demands = await Demand.find();
        res.status(200).json(demands);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteDemand = async (req, res) => {
    try {
        const id = req.params.id;
        await Demand.findByIdAndDelete(id);
        res.status(200).json({ message: 'Talep başarıyla silindi.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};