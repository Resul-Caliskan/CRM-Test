const express = require("express");
const router = express.Router();
const multer = require("multer");
const pdfController = require("../controllers/cvController");
const authenticationMiddleware = require("../middlewares/authenticationMiddleware");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/getcv",
  authenticationMiddleware.authenticateToken,
  pdfController.sendPdf
);
router.get(
  "/getallcvs/:id",
  authenticationMiddleware.authenticateToken,
  pdfController.getPdfById
);

module.exports = router;
