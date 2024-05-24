const Nominee = require("../models/nominee");
const Position = require("../models/position");
const Customer = require("../models/customer");
const { findMatches } = require("../utils/matchingCv");
const fs = require('fs');
const path = require('path');

exports.getNomineeByCompanyId = async (req, res) => {
  try {
    const { isAdmin, companyId, page, pageSize, filters, searchTerm } = req.body;
    const positions = await Position.find({ companyId });
    let sharedNomineesIdsFromPosition = [];
    positions.forEach((position) => {
      position.sharedNominees.forEach((aday) => {
        sharedNomineesIdsFromPosition.push(aday);
      });
    });

    let query = {};
    if (filters.jobtitle.length > 0) {
      query.title = { $in: filters.jobtitle };
    }

    if (filters.skills.length > 0) {
      query.skills = { $all: filters.skills.map(skill => skill) };
    }
    if (sharedNomineesIdsFromPosition.length > 0) {
      query._id = { $nin: sharedNomineesIdsFromPosition };
    }
    const skip = (page - 1) * pageSize;
    const limit = pageSize;


    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm, "i");
      query.$or = [
        { title: searchRegex },
        { skills: { $elemMatch: { $regex: searchRegex } } }
      ];
    }

    let allCvs = await Nominee.find(query)
      .select('-name -contact')
      .skip(skip)
      .limit(limit);
    const totalAllCvsCount = await Nominee.countDocuments(query);

    res.status(200).json({
      allCvs: allCvs,
      totalCvsCount: totalAllCvsCount,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
};

exports.getSharedNominees = async (req, res) => {
  try {
    const { companyId, page, pageSize, filters = {}, searchTerm } = req.body;
    const positions = await Position.find({ companyId });

    const sharedNomineesData = positions.reduce((acc, position) => {
      position.sharedNominees.forEach((aday) => {
        acc.push({
          adayId: aday,
          position: { id: position._id, title: position.jobtitle },
        });
      });
      return acc;
    }, []);

    const nomineeIds = sharedNomineesData.map(data => data.adayId);

    if (nomineeIds.length === 0) {
      return res.status(200).json({
        sharedNominees: [],
        totalCvsCount: 0
      });
    }

    let query = { _id: { $in: nomineeIds } };

    if (filters.jobtitle && filters.jobtitle.length > 0) {
      query.title = { $in: filters.jobtitle };
    }

    if (filters.skills && filters.skills.length > 0) {
      query.skills = { $all: filters.skills };
    }

    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm, "i");
      query.$or = [
        { title: searchRegex },
        { skills: { $elemMatch: { $regex: searchRegex } } }
      ];
    }

    const skip = (page - 1) * pageSize;
    const limit = pageSize;

    // Fetch nominees and total count in parallel
    const [nominees, totalAllCvsCount] = await Promise.all([
      Nominee.find(query).skip(skip).limit(limit),
      Nominee.countDocuments(query)
    ]);

    const sharedNominees = nominees.map(nominee => {
      const nomineeData = sharedNomineesData.find(data => data.adayId.equals(nominee._id));
      return {
        nomineeInfo: nominee,
        position: nomineeData.position
      };
    });

    res.status(200).json({
      sharedNominees,
      totalCvsCount: totalAllCvsCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
};

exports.getAllNominees = async (req, res) => {
  try {
    const { isAdmin, companyId, page, pageSize, filters = {}, searchTerm } = req.body;
    const positions = await Position.find({ companyId });

    const sharedNomineesData = positions.reduce((acc, position) => {
      position.sharedNominees.forEach((aday) => {
        acc.push({
          adayId: aday,
          position: { id: position._id, title: position.jobtitle },
        });
      });
      return acc;
    }, []);

    const sharedNomineeIds = sharedNomineesData.map(data => data.adayId);

    let query = {};

    if (filters.jobtitle && filters.jobtitle.length > 0) {
      query.title = { $in: filters.jobtitle };
    }

    if (filters.skills && filters.skills.length > 0) {
      query.skills = { $all: filters.skills };
    }

    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm, "i");
      query.$or = [
        { title: searchRegex },
        { skills: { $elemMatch: { $regex: searchRegex } } }
      ];
    }

    const [allNominees, totalNomineesCount] = await Promise.all([
      Nominee.find(query).lean(),
      Nominee.countDocuments(query)
    ]);

    const combinedNominees = allNominees.map(nominee => {
      const isShared = sharedNomineeIds.some(id => id.equals(nominee._id));
      const positionData = sharedNomineesData.find(data => data.adayId.equals(nominee._id));

      if (!isAdmin && !isShared) {
        nominee.name = "";
        nominee.contact = "";
      }

      return {
        nomineeInfo: nominee,
        isShared,
        position: isShared ? positionData.position : null
      };
    });

    const skip = (page - 1) * pageSize;
    const paginatedNominees = combinedNominees.slice(skip, skip + pageSize);

    res.status(200).json({
      allNominees: paginatedNominees,
      totalCvsCount: totalNomineesCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
};

exports.addFavorite = async (req, res) => {
  console.log(req.body.nomineeId);
  console.log(req.params.id);
  try {
    const nominee = req.body.nomineeId;
    const companyId = req.params.id;

    const customer = await Customer.findById(companyId);
    if (customer.favorites.includes(nominee)) {
      return res.status(400).json({ error: "Bu aday zaten favorilerde." });
    }
    const updatedCustomer = await Customer.findByIdAndUpdate(
      companyId,
      {
        $push: { favorites: [nominee] },
      },
      { new: true }
    );
    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.log("SELamu");
    res.status(500).json({ error: error.message });
  }
};

exports.getAllFavorites = async (req, res) => {
  try {
    const companyId = req.params.id;

    const customer = await Customer.findById(companyId);

    const favoriteIds = customer.favorites;

    res.status(200).json({ favorites: favoriteIds });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteFavorites = async (req, res) => {
  console.log(req.body.nomineeId);
  console.log(req.params.id);
  try {
    const nominee = req.body.nomineeId;
    const companyId = req.params.id;

    const updatedCustomer = await Customer.findByIdAndUpdate(
      companyId,
      {
        $pull: { favorites: nominee },
      },
      { new: true }
    );
    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.log("SELamu");
    res.status(500).json({ error: error.message });
  }
};

exports.getNomineeByPositionId = async (req, res) => {
  try {
    const positionId = req.body.positionId;
    const isAdmin = req.body.isAdmin;
    const positions = await Position.findById(positionId);
    const requestedNominees = [];
    let sharedNomineesFromPosition = [];
    let skills = [];

    let title = positions.jobtitle;

    positions.skills.forEach((skill) => {
      skills.push(skill);
    });
    positions.sharedNominees.forEach((aday) => {
      sharedNomineesFromPosition.push(aday);
    });

    for (const aday of positions.requestedNominees) {
      if (isAdmin) {
        try {
          const requestedNominee = await Nominee.findOne(aday);
          requestedNominees.push(requestedNominee);
        } catch (error) {
          console.error("Bir hata oluştu:", error);
        }
      } else {
        try {
          const requestedNominee = await Nominee.findOne(aday, {
            name: 0,
            contact: 0,
          });
          requestedNominees.push(requestedNominee);
        } catch (error) {
          console.error("Bir hata oluştu:", error);
        }
      }
    }

    let sharedNominees = [];

    await Promise.all(
      sharedNomineesFromPosition.map(async (aday) => {
        const nominee = await Nominee.findById(aday);
        sharedNominees.push(nominee);
      })
    );

    let sharedNomineesRate = findMatches(skills, sharedNominees);

    let allCvs = [];

    if (isAdmin) {
      allCvs = await Nominee.find({
        $and: [
          { title: { $in: title } },
          {
            _id: {
              $nin: sharedNominees
                .map((aday) => aday._id)
                .concat(requestedNominees.map((aday) => aday._id)),
            },
          },
        ],
      });
    } else {
      allCvs = await Nominee.find(
        {
          $and: [
            { title: { $in: title } },
            {
              _id: {
                $nin: sharedNominees
                  .map((aday) => aday._id)
                  .concat(requestedNominees.map((aday) => aday._id)),
              },
            },
          ],
        },
        {
          name: 0,
          contact: 0,
        }
      );
    }

    let suggestedAllCvs = findMatches(skills, allCvs);
    let requestedCv = findMatches(skills, requestedNominees);
    res.status(200).json({
      sharedNominees: sharedNomineesRate,
      suggestedAllCvs: suggestedAllCvs,
      requestedNominees: requestedCv,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

exports.getSharedomineesByPositionId = async (req, res) => {
  try {
    const positionId = req.body.positionId;
    const position = await Position.findById(positionId);

    if (!position) {
      return res.status(404).json({ message: "Position not found" });
    }

    let skills = [];
    position.skills.forEach((skill) => {
      skills.push(skill);
    });


    let sharedNomineesIdsFromPosition = [];

    position.sharedNominees.forEach((adayId) => {
      sharedNomineesIdsFromPosition.push(adayId);
    });

    let sharedNominees = [];
    await Promise.all(
      sharedNomineesIdsFromPosition.map(async (adayId) => {
        const nominee = await Nominee.findById(adayId);
        if (nominee) {
          sharedNominees.push(nominee);
        }
      })
    );

    let sharedNomineesRate = findMatches(skills, sharedNominees);

    res.status(200).json({
      sharedNominees: sharedNomineesRate,
    });
  } catch (error) {
    console.error("Error fetching shared nominees:", error);
    res.status(500).json({
      message: "An error occurred while fetching shared nominees",
      error: error.message,
    });
  }
};

exports.getRequestedNomineesByPositionId = async (req, res) => {
  try {
    const positionId = req.body.positionId;
    const isAdmin = req.body.isAdmin;

    const position = await Position.findById(positionId);
    
    if (!position) {
      return res.status(404).json({ message: "Position not found" });
    }

    let skills = position.skills || [];

    let requestedNominees = [];

    for (const aday of position.requestedNominees) {
      if (isAdmin) {
        try {
          const requestedNominee = await Nominee.findOne(aday);
          requestedNominees.push(requestedNominee);
        } catch (error) {
          console.error("Bir hata oluştu:", error);
        }
      } else {
        try {
          const requestedNominee = await Nominee.findOne(aday, {
            name: 0,
            contact: 0,
          });
          requestedNominees.push(requestedNominee);
        } catch (error) {
          console.error("Bir hata oluştu:", error);
        }
      }
    }

    requestedNominees = requestedNominees.filter(nominee => nominee !== null);

    let requestedCv = findMatches(skills, requestedNominees);

    res.status(200).json({
      requestedNominees: requestedCv,
    });
  } catch (error) {
    console.error("Error fetching requested nominees:", error);
    res.status(500).json({
      message: "An error occurred while fetching requested nominees",
      error: error.message,
    });
  }
};

exports.getSuggestedNomineesByPositionId = async (req, res) => {
  try {
    const { positionId, isAdmin, page = 1, limit = 10 } = req.body;
    const positions = await Position.findById(positionId);

    if (!positions) {
      return res.status(404).json({ message: "Position not found" });
    }

    const title = positions.jobtitle;
    const skills = positions.skills || [];
    const requestedNomineesIds = positions.requestedNominees || [];
    const sharedNomineesIds = positions.sharedNominees || [];
    const excludedNomineeIds = requestedNomineesIds.concat(sharedNomineesIds);

    let query = {
      title: { $in: title },
      _id: { $nin: excludedNomineeIds },
    };

    const totalNominees = await Nominee.countDocuments(query);

    let allCvs;
    if (isAdmin) {
      allCvs = await Nominee.find(query)
        .skip((page - 1) * limit)
        .limit(limit);
    } else {
      allCvs = await Nominee.find(query, { name: 0, contact: 0 })
        .skip((page - 1) * limit)
        .limit(limit);
    }

    const suggestedAllCvs = findMatches(skills, allCvs);
    res.status(200).json({
      suggestedAllCvs,
      totalPages: Math.ceil(totalNominees / limit),
      currentPage: page,
      totalNominees,
    });
  } catch (error) {
    console.error("Error fetching nominees:", error);
    res.status(500).json({
      message: "An error occurred while fetching nominees",
      error: error.message,
    });
  }
};


exports.addNominee = async (req, res) => {
  try {
    const newNominee = new Nominee({
      name: req.body.name,
      title: req.body.title,
      contact: req.body.contact,
      skills: req.body.skills,
      experience: req.body.experience,
      education: req.body.education,
    });
    await newNominee.save();
    res.status(201).json({ message: "Aday başarıyla eklendi." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




exports.getPdfById = async (req, res) => {
  try {
    const id = req.params.id;
    const nominee = await Nominee.findById(id);
    console.log(id);
    if (!nominee) {
      return res.status(404).json({ error: 'Nominee not found' });
    }
    const cvUrl = nominee.cvUrl;
    if (!cvUrl) {
      return res.status(404).json({ error: 'CV not found for this nominee' });
    }
    const fileName = path.basename(cvUrl);
    console.log(fileName);
    res.status(200).json({ fileName });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.downloadCv = (req, res) => {
  try {
    const fileName = req.body.fileName;
    const filePath = path.join(__dirname, '/../../files', fileName);
    if (!filePath) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.status(200).download(filePath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
