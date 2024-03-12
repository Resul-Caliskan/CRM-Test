const Nominee = require("../models/nominee");
const position = require("../models/position");
const Position = require("../models/position")
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
        await Promise.all(paylasilanAdaylar.map(async (aday) => {
            const nominee = await Nominee.findById(aday);
            sharedNominees.push(nominee);
        }));
        console.log("TİTLEEEEE " + title);
        //buradaki $nin fonksiyonu sharedNominees içinde olan verilerin allCv'ye gelmemesini sağlıyor..
        let allCv = await Nominee.find({ title: { $in: title }, _id: { $nin: sharedNominees.map(aday => aday._id) } });
        //console.log(allCv);
        res.status(200).json({ sharedNominees: sharedNominees, allCv: allCv });
    } catch (error) {
        console.log("hataaaaa");
    }
};


exports.addNominee = async (req, res) => {
    try {
        console.log("AAAAAAAABBBBBB" + req.body.name);

        const newNominee = new Nominee({
            name: req.body.name,
            title: req.body.title,
            contact: req.body.contact,
            skills: req.body.skills,
            experience: req.body.experience,
            education: req.body.education,

        });
        await newNominee.save();
        res.status(201).json({ message: 'Aday başarıyla eklendi.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.getNomineeByPositionId = async (req, res) => {
    try {
        const positionId = req.body.positionId;
        console.log("POZİSYON ID'Sİ "+positionId);
        const positions = await Position.findById(positionId);
        let paylasilanAdaylar = [];
        let title = positions.jobtitle;
        
        positions.paylasilanAdaylar.forEach((aday) => {
            console.log("POZİSYON "+positions);

            paylasilanAdaylar.push(aday);
            console.log("ADAYYY "+aday);
        });
        let sharedNominees = [];
        await Promise.all(paylasilanAdaylar.map(async (aday) => {
            const nominee = await Nominee.findById(aday);
            sharedNominees.push(nominee);
        }));
        console.log("TİTLEEEEE " + title);
        //buradaki $nin fonksiyonu sharedNominees içinde olan verilerin allCv'ye gelmemesini sağlıyor..
        let allCv = await Nominee.find({ title: { $in: title }, _id: { $nin: sharedNominees.map(aday => aday._id) } });
        //console.log(allCv);
        res.status(200).json({ sharedNominees: sharedNominees, allCv: allCv });
    } catch (error) {
        // Hata yönetimi
    }
};



exports.getNomineeByCompanyIdUser = async (req, res) => {
    try {
        console.log("ADAY NOMİNEESİ:");
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
        await Promise.all(paylasilanAdaylar.map(async (aday) => {
            const nominee = await Nominee.findById(aday);
            sharedNominees.push(nominee);
        }));

        // 'name' ve 'contact' alanlarını hariç tutarak diğer tüm alanları getiriyoruz
        let allCv = await Nominee.find(
            { 
                title: { $in: title }, 
                _id: { $nin: sharedNominees.map(aday => aday._id) } 
            },
            // 'name' ve 'contact' alanlarını hariç tutuyoruz
            { 
                name: 0, 
                contact: 0
            }
        );
        console.log("ALLCVVVVV "+allCv);

        res.status(200).json({ sharedNominees: sharedNominees, allCv: allCv });
    } catch (error) {
        console.log("hataaaaa");
    }
};
