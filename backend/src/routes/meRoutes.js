const express = require("express");
const authenticationMiddleware = require("../middlewares/authenticationMiddleware");
const Customer = require("../models/customer");

const { userCache } = require("../config/userCache");
const router = express.Router();

router.get("/me", authenticationMiddleware.authenticateToken, async (req, res) => {
  const id = req.user.id;
  const cachedUsers = userCache.get(id);

  if (cachedUsers.id === id) {
    const company = await Customer.findById(cachedUsers.companyId);
    res.json({
      message: "Hoş Geldin!" + " " + cachedUsers.email + " " + cachedUsers.role,
      user: { email: cachedUsers.email, role: cachedUsers.role, name: cachedUsers.name, surname: cachedUsers.surname, company, phone: cachedUsers.phone ,id:cachedUsers.id },
    });
  }
});

module.exports = router;
