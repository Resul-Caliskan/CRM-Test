const User = require("../models/user");

const express = require("express");

// controllers/customerController.js
const Customer = require("../models/customer");

// Müşteri ekleme işlemi
exports.addCustomer = async (req, res) => {
  try {
    console.log("BODYYYY" + req.body.companycountry);
    const newCustomer = new Customer({
      companyname: req.body.companyname,
      companytype: req.body.companytype,
      companysector: req.body.companysector,
      companyadress: req.body.companyadress,
      companycity: req.body.companycity,
      companycountry: req.body.companycountry,
      companyweb: req.body.companyweb,
      contactname: req.body.contactname,
      contactmail: req.body.contactmail,
      contactnumber: req.body.contactnumber,
      companycounty: req.body.companycounty,
      // Diğer müşteri bilgileri...
    });
    await newCustomer.save();
    console.log("Başarılı");
    res.status(201).json({ message: "Müşteri başarıyla eklendi." });
  } catch (error) {
    console.log("Kaydedilmedi" + error);
    res.status(500).json({ error: error.message });
  }
};

//
exports.userAddToCustomer = async (req, res) => {
  try {
    console.log("GELDİİİİİ" + req.body.email);
    const user = req.body;
    const newUser = new User({
      email: user.email,
      password: user.password,
      companyId: req.params.id,
      role: req.body.role,
    });
    newUser
      .save()
      .then(() => {
        console.log("Kullanıcı başarıyla eklendi.");
      })
      .catch((err) => {
        console.error("Kullanıcı eklenirken hata oluştu:", err);
      });

    const id = req.params.id;
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      {
        $push: { users: [newUser._id] },
      },
      { new: true }
    );
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Müşteri güncelleme işlemi
exports.updateCustomer = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        companyname: req.body.companyname,
        companytype: req.body.companytype,
        companysector: req.body.companysector,
        companyadress: req.body.companyadress,
        companycity: req.body.companycity,
        companycountry: req.body.companycountry,
        companyweb: req.body.companyweb,
        contactname: req.body.contactname,
        contactmail: req.body.contactmail,
        contactnumber: req.body.contactnumber,
        companycounty: req.body.companycounty,
      },
      { new: true }
    );
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Müşteri silme işlemi
exports.deleteCustomer = async (req, res) => {
  try {
    const id = req.params.id;
    await Customer.findByIdAndDelete(id);
    res.status(200).json({ message: "Müşteri başarıyla silindi." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tüm müşterileri çekme işlemi
exports.getAllCustomers = async (req, res) => {
  try {
    console.log("SİRKETLER GELDİ.");
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Müşteri ID'sine göre müşteriyi getirme işlemi
exports.getCustomerById = async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Müşteri bulunamadı." });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCustomerByName = async (req, res) => {
  try {
    const customerName = req.params.name;
    const customer = await Customer.findOne(customerName);

    if (!customer) {
      return res.status(404).json({ message: "Müşteri bulunamadı." });
    }

    res.status(200).json(customer._id);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("buraya girdin grdaş");
  }
};

exports.getCustomerNameById = async (req, res) => {
  try {
   
    const customerId = req.params.id;
    console.log("customerId namee:"+customerId);
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Müşteri bulunamadı." });
    }
    res.status(200).json({ customername: customer.companyname });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
