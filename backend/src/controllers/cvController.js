const Cv = require("../models/cv");

exports.getPdfById = async (req, res) => {
  try {
    const id = req.params.id;
    const cvs = await Cv.find({ companyId: id });
    res.status(200).json(cvs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.sendPdf = (req, res) => {
  try {
    const fileName = req.body.filename;
    res.status(200).sendFile(fileName, { root: __dirname + "/../../files" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};