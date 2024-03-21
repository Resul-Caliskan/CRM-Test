const User = require("../models/user");

const express = require("express");

// user ekleme işlemi
exports.checkUserMail = async (req, res) => {
  const mail = req.body.email;
  try {
    const users = await User.findOne({ email: mail });
    res.status(200).json({ id: users._id });
    console.log("users" + users);
  } catch (error) {
    res.status(400).json({ message: "Böyle Bir Kullanıcı Bulunamadı" });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const updatedPassword = await User.findByIdAndUpdate(
      req.params.id,
      {
        password: req.body.password,
      },
      { new: true }
    );
    res.status(200).json(updatedPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
