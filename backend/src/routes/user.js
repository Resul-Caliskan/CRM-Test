const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authenticationMiddleware = require("../middlewares/authenticationMiddleware");
const secretkey = "yusuf";
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Kullanıcı Adı Veya Şifre Yanlış" });
    }

    if (password !== user.password) {
      return res.status(401).json({ error: "Kullanıcı Adı Veya Şifre Yanlış" });
    }

    const token = jwt.sign({ email }, secretkey);

    return res.status(202).json({ token: token });
  } catch (error) {
    res.status(500).send("Giriş yapılırken bir hata oluştu.");
  }
});

router.get(
  "/users",
  authenticationMiddleware.authenticateToken,
  async (req, res) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Giriş Reddeildi" });
    try {
      const decoded = jwt.verify(token, secretkey);
      req.user = decoded;
      res.status(200).send(req.user);
    } catch (error) {
      res.status(400).send("Geçersiz Token");
    }
  }
);

module.exports = router;
