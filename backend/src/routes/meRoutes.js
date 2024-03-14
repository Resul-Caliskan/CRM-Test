const express = require("express");
const authenticationMiddleware = require("../middlewares/authenticationMiddleware");

const { userCache } = require("../config/userCache");
const router = express.Router();

router.get("/me", authenticationMiddleware.authenticateToken, (req, res) => {
  const id = req.user.id;
  const cachedUsers = userCache.get(id);
  console.log("İD:"+id);
  console.log("CACHED USERS:" + cachedUsers);
  if (cachedUsers.id === id) {
    res.json({
      message: "Hoş Geldin!" + " " + cachedUsers.email + " " + cachedUsers.role,
      user: { email: cachedUsers.email, role: cachedUsers.role },
    });
  }
});

module.exports = router;