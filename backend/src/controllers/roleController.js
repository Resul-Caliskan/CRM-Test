const Role = require("../models/role");

exports.addRole = async (req, res) => {
  try {
    const newRole = new Role({
      role: req.body.role,
    });
    await newRole.save();
    res.status(201).json({ message: "Rol başarıyla eklendi." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    await Role.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Rol başarıyla silindi." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
