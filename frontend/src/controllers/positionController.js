const Position = require("../models/position");

const express = require("express");

// Pozisyon ekleme işlemi
exports.addPosition = async (req, res) => {
  try {
    const newPosition = new Position({
      department: req.body.department,
      jobtitle: req.body.jobtitle,
      experienceperiod: req.body.experienceperiod,
      modeofoperation: req.body.modeofoperation,
      description: req.body.description,
      skills: req.body.skills,
      worktype: req.body.worktype,
      companyId: req.body.companyId,
      companyName: req.body.companyName,
    });

    console.log("POZİSYON" + newPosition);
    await newPosition.save();

    res.status(201).json({ message: "Pozisyon başarıyla eklendi." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tüm pozisyonları çekme işlemi
exports.getAllPositions = async (req, res) => {
  try {
    const positions = await Position.find();
    res.status(200).json(positions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Id ye göre çekme işlemi
exports.getPositionById = async (req, res) => {
  try {
    console.log("idye göre .ekmeye girdi " + req.params.id);
    const positionId = req.params.id;
    const position = await Position.findById(positionId);

    if (!position) {
      return res.status(404).json({ message: "Müşteri bulunamadı." });
    }

    res.status(200).json(position);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Pozisyon silme işlemi
exports.deletePosition = async (req, res) => {
  try {
    const id = req.params.id;
    await Position.findByIdAndDelete(id);
    res.status(200).json({ message: "Pozisyon başarıyla silindi." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Pozisyon güncelleme işlemi
exports.updatePosition = async (req, res) => {
  try {
    const updatedPosition = await Position.findByIdAndUpdate(
      req.params.id,
      {
        department: req.body.department,
        jobtitle: req.body.jobtitle,
        experienceperiod: req.body.experienceperiod,
        modeofoperation: req.body.modeofoperation,
        description: req.body.description,
        skills: req.body.skills,
        worktype: req.body.worktype,
        companyId: req.body.companyId,
        companyName: req.body.companyName,
      },
      { new: true }
    );
    res.status(200).json(updatedPosition);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addNomineeIdToPosition = async (req, res) => {
  try {
    console.log("GELDİİİİİ" + req.params.id);
    const nominee = req.body.nomineeId;
    const id = req.params.id;
    const updatedPosition = await Position.findByIdAndUpdate(
      id,
      {
        $push: { sharedNominees: [nominee] },
      },
      { new: true }
    );
    res.status(200).json(updatedPosition);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPositionByCompanyId = async (req, res) => {
  try {
    console.log(
      "Şirket ID'sine göre pozisyonları getirme işlemine girdi " + req.params.id
    );
    const companyId = req.params.id;
    const positions = await Position.find({ companyId: companyId });

    if (!positions || positions.length === 0) {
      return res
        .status(404)
        .json({ message: "Şirkete ait pozisyonlar bulunamadı." });
    }

    res.status(200).json(positions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteNomineeIdFromPosition = async (req, res) => {
  try {
    console.log("GELDİİİİİ" + req.params.id);
    const nominee = req.body.nomineeId;
    const id = req.params.id;
    const updatedPosition = await Position.findByIdAndUpdate(
      id,
      {
        $pull: { sharedNominees: nominee },
      },
      { new: true }
    );
    res.status(200).json(updatedPosition);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};