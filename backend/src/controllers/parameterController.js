const Parameter = require("../models/parameter");

const express = require('express');




exports.addParameter = async (req, res) => {
    try {
        const filter = req.body.title;
        const newValue = req.body.values;
        console.log("FİLİTRE " + filter);
        console.log("YENİ DEĞER " + newValue);

        const existingParameter = await Parameter.findOne({ title: filter });
        console.log("VAR MI YOK MU: " + existingParameter);

        if (existingParameter !== null) {
            console.log("BURAYA GİRDİK!éééé'^'");
            existingParameter.values.push(newValue);
            const updatedParameter = await existingParameter.save();
            console.log(updatedParameter);
        } else {
            console.log("OLMAYAN VERİ EKLENDİ!!!!!");
            const newParameter = new Parameter({
                title: filter,
                values: [newValue],
            });

            console.log("Title " + newParameter.title);
            await newParameter.save();
        }

        res.status(201).json({ message: 'Title başarıyla eklendi.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Tüm Parametreleri çekme işlemi
exports.getAllParameters = async (req, res) => {
    try {
        const parameters = await Parameter.find();
        res.status(200).json(parameters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//Parametre silme işlemi
exports.deleteParameter = async (req, res) => {
    try {
        await Parameter.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Parametre başarıyla silindi.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//Parametre güncelleme işlemi
exports.updateParameter = async (req, res) => {
    try {
        const updatedParameter = await Parameter.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                values:req.body.values,
               

            },
            { new: true }
        );
        res.status(200).json(updatedParameter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};







