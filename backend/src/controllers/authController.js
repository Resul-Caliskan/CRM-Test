const jwt = require("jsonwebtoken");
const config = require("../config/config");
const User = require("../models/user");
const TokenExpiredError = require("jsonwebtoken/lib/TokenExpiredError");
const { userCache } = require("../config/userCache");

async function login(req, res) {
  const { email, password } = req.body;
  console.log(email + " " + password);

  try {
    const user = await User.findOne({ email, password });
    console.log("KULLANICI: ", user);

    if (!user) {
      return res.status(400).json({ message: "Geçersiz Kullanıcı Bilgileri" });
    }

    const id = user._id;
    const companyId = user.companyId;

    userCache.set(id.toString(), user);

    const accessToken = jwt.sign({ id, companyId }, config.secretKey, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ id, companyId }, config.secretKey, {
      expiresIn: "7d",
    });

    res.json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login Hatası:", error);
    res.status(500).json({ message: "Sunucu Hatası" });
  }
}

module.exports = { login };

async function refreshAccessToken(req, res) {
  const { refreshToken } = req.body;

  try {
    const data = verifyRefreshToken(refreshToken);
    if (data === "jwt expired") {
      return res.status(403).json({ message: "Expired refresh token" });
    }

    if (!data) {
      return res.status(401).json({ message: "Geçersiz refresh token" });
    }

    const newAccessToken = jwt.sign(
      { id: data.id, companyId: data.companyId },
      config.secretKey,
      {
        expiresIn: "15m",
      }
    );

    res.status(201).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ message: "Sunucu Hatası" });
  }
}

function verifyRefreshToken(refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, config.secretKey);
    console.log("DECODED IDDD" + decoded.id);
    return { id: decoded.id, companyId: decoded.companyId };
  } catch (error) {
    //return null;
    console.log("AGİRDİAAA" + error.message);
    if (error instanceof TokenExpiredError) return error.message;
  }
}

module.exports = { login, refreshAccessToken, verifyRefreshToken };
