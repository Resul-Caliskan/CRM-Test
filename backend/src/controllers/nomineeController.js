const Nominee = require("../models/nominee");
const position = require("../models/position");
const Position = require("../models/position");
const express = require("express");

exports.getNomineeByCompanyIdAdmin = async (req, res) => {
  try {
    const companyId = req.body.companyId;
    const positions = await Position.find({ companyId: companyId });
    let paylasilanAdaylar = [];
    let title = [];

    positions.forEach((position) => {
      title.push(position.jobtitle);
      position.paylasilanAdaylar.forEach((aday) => {
        paylasilanAdaylar.push(aday);
      });
    });
    let sharedNominees = [];
    await Promise.all(
      paylasilanAdaylar.map(async (aday) => {
        const nominee = await Nominee.findById(aday);
        sharedNominees.push(nominee);
      })
    );
    
    //buradaki $nin fonksiyonu sharedNominees içinde olan verilerin allCv'ye gelmemesini sağlıyor..
    let allCv = await Nominee.find({
      title: { $in: title },
      _id: { $nin: sharedNominees.map((aday) => aday._id) },
    });
    //console.log(allCv);
    res.status(200).json({ sharedNominees: sharedNominees, allCv: allCv });
  } catch (error) {
   
  }
};

exports.addNominee = async (req, res) => {
  try {
    

    const newNominee = new Nominee({
      name: req.body.name,
      title: req.body.title,
      contact: req.body.contact,
      skills: req.body.skills,
      experience: req.body.experience,
      education: req.body.education,
    });
    await newNominee.save();
    res.status(201).json({ message: "Aday başarıyla eklendi." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNomineeByPositionIdAdmin = async (req, res) => {
  try {
    const positionId = req.body.positionId;
    
    const positions = await Position.findById(positionId);
    let paylasilanAdaylar = [];
    let title = positions.jobtitle;

    positions.paylasilanAdaylar.forEach((aday) => {
     

      paylasilanAdaylar.push(aday);
    
    });
    let sharedNominees = [];
    await Promise.all(
      paylasilanAdaylar.map(async (aday) => {
        const nominee = await Nominee.findById(aday);
        sharedNominees.push(nominee);
      })
    );
  
    
    let allCv = await Nominee.find({
      title: { $in: title },
      _id: { $nin: sharedNominees.map((aday) => aday._id) },
    });
   
    res.status(200).json({ sharedNominees: sharedNominees, allCv: allCv });
  } catch (error) {
   
  }
};

exports.getNomineeByCompanyIdUser = async (req, res) => {
  try {
    const companyId = req.body.companyId;
    const positions = await Position.find({ companyId: companyId });
    let paylasilanAdaylar = [];
    let title = [];

    positions.forEach((position) => {
      title.push(position.jobtitle);
      position.paylasilanAdaylar.forEach((aday) => {
        paylasilanAdaylar.push(aday);
      });
    });
    let sharedNominees = [];
    await Promise.all(
      paylasilanAdaylar.map(async (aday) => {
        const nominee = await Nominee.findById(aday);
        sharedNominees.push(nominee);
      })
    );

   
    let allCv = await Nominee.find(
      {
        title: { $in: title },
        _id: { $nin: sharedNominees.map((aday) => aday._id) },
      },
      
      {
        name: 0,
        contact: 0,
      }
    );
    

    res.status(200).json({ sharedNominees: sharedNominees, allCv: allCv });
  } catch (error) {
    
  }
};

exports.getNomineeByPositionIdUser = async (req, res) => {
  try {
    const positionId = req.body.positionId;
    const positions = await Position.findById(positionId);
    let paylasilanAdaylar = [];
    let title = positions.jobtitle;

    positions.paylasilanAdaylar.forEach((aday) => {
      paylasilanAdaylar.push(aday);
    });
    let sharedNominees = [];
    await Promise.all(
      paylasilanAdaylar.map(async (aday) => {
        const nominee = await Nominee.findById(aday);
        sharedNominees.push(nominee);
      })
    );

    let allCv = await Nominee.find(
      {
        title: { $in: title },
        _id: { $nin: sharedNominees.map((aday) => aday._id) },
      },

      {
        name: 0,
        contact: 0,
      }
    );
    console.log("TİTLEEEEE " + title);

    res.status(200).json({ sharedNominees: sharedNominees, allCv: allCv });
  } catch (error) {}
};
