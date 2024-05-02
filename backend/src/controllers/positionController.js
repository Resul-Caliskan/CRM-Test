const Position = require("../models/position");
exports.addPosition = async (req, res) => {
  try {
    const newPosition = new Position({
      department: req.body.department,
      jobtitle: req.body.jobtitle,
      experienceperiod: req.body.experienceperiod,
      modeofoperation: req.body.modeofoperation,
      description: req.body.description,
      skills: req.body.skills,
      worktype: req.body.worktype,
      companyId: req.body.companyId,
      companyName: req.body.companyName,
      dateOfStart: req.body.dateOfStart,
      bannedCompanies: req.body.bannedCompanies,
      preferredCompanies: req.body.preferredCompanies,
      industry: req.body.industry,
      positionCity: req.body.positionCity,
      positionAdress: req.body.positionAdress,
      positionCounty: req.body.positionCounty,
      positionCountry: req.body.positionCountry,
    });

    const duplicates = newPosition.requestedNominees.filter((value, index, self) => self.indexOf(value) !== index);
    if (duplicates.length > 0) {
      throw new Error('Duplicate entries found in requestedNominees.');
    }

    await newPosition.save();

    res.status(201).json({ message: "Pozisyon başarıyla eklendi." , positionId:newPosition._id});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllPositions = async (req, res) => {
  try {
    const positions = await Position.aggregate([
      {
        $addFields: {
          requestedNomineesCount: { $size: "$requestedNominees" },
        },
      },
      {
        $sort: { requestedNomineesCount: -1 },
      },
    ]);
    res.status(200).json(positions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPositionById = async (req, res) => {
  try {
    const positionId = req.params.id;
    const position = await Position.findById(positionId);

    if (!position) {
      return res.status(404).json({ message: "Müşteri bulunamadı." });
    }

    res.status(200).json(position);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePosition = async (req, res) => {
  try {
    const id = req.params.id;
    await Position.findByIdAndDelete(id);
    res.status(200).json({ message: "Pozisyon başarıyla silindi." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePosition = async (req, res) => {
  try {
    const updatedPosition = await Position.findByIdAndUpdate(
      req.params.id,
      {
        department: req.body.department,
        jobtitle: req.body.jobtitle,
        experienceperiod: req.body.experienceperiod,
        modeofoperation: req.body.modeofoperation,
        description: req.body.description,
        skills: req.body.skills,
        worktype: req.body.worktype,
        companyId: req.body.companyId,
        companyName: req.body.companyName,
        industry: req.body.industry,
        dateOfStart: req.body.dateOfStart,
        positionCity: req.body.positionCity,
        bannedCompanies: req.body.bannedCompanies,
        preferredCompanies: req.body.preferredCompanies,
        positionAdress: req.body.positionAdress,
        positionCounty: req.body.positionCounty,
        positionCountry: req.body.positionCountry,
      },
      { new: true }
    );
    res.status(200).json(updatedPosition);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addNomineeIdToPosition = async (req, res) => {
  try {
    const nominee = req.body.nomineeId;
    const id = req.params.id;
    const updatedPosition = await Position.findByIdAndUpdate(
      id,
      {
        $push: { sharedNominees: [nominee] },
      },
      { new: true }
    );
    res.status(200).json(updatedPosition);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.requestNominee = async (req, res) => {
  try {
    const nominee = req.body.nomineeId;
    const id = req.params.id;

    // İlgili pozisyonu bul
    const position = await Position.findById(id);

    // Eğer aday zaten talep edilmişse hata döndür
    if (position.requestedNominees.includes(nominee)) {
      return res.status(400).json({ error: "Bu aday zaten talep edilmiş." });
    }

    // Talep sayısını artır
    const demandCount = position.requestedNominees.length + 1;

    // Pozisyonu güncelle
    const updatedPosition = await Position.findByIdAndUpdate(
      id,
      {
        $push: { requestedNominees: [nominee] },
      },
      { new: true }
    );

    // Talep sayısını WebSocket üzerinden gönder
    //io.emit(`positionDemandCountUpdated_${id}`, demandCount);

    // Güncellenmiş pozisyonu ve talep sayısını döndür
    res.status(200).json({ updatedPosition, demandCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteRequestedNomineeFromPosition = async (req, res) => {
  try {
    const nominee = req.body.nomineeId;
    const id = req.params.id;
    const updatedPosition = await Position.findByIdAndUpdate(
      id,
      {
        $pull: { requestedNominees: nominee },
      },
      { new: true }
    );
    res.status(200).json(updatedPosition);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPositionByCompanyId = async (req, res) => {
  try {
    const companyId = req.params.id;
    const positions = await Position.find({ companyId: companyId });

    if (!positions || positions.length === 0) {
      return res
        .status(404)
        .json({ message: "Şirkete ait pozisyonlar bulunamadı." });
    }

    res.status(200).json(positions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteNomineeIdFromPosition = async (req, res) => {
  try {
    const nominee = req.body.nomineeId;
    const id = req.params.id;
    const updatedPosition = await Position.findByIdAndUpdate(
      id,
      {
        $pull: { sharedNominees: nominee },
      },
      { new: true }
    );
    res.status(200).json(updatedPosition);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.moveRequestedNomineeToSharedNominees = async (req, res) => {
  try {

    const nomineeId = req.body.nomineeId;

    const updatedPosition = await Position.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { requestedNominees: nomineeId },
        $push: { sharedNominees: nomineeId },

      },

      { new: true }
    );

    res.status(200).json(updatedPosition);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
