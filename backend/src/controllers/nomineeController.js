const Nominee = require("../models/nominee");
const Position = require("../models/position");
const Customer = require("../models/customer");
const { findMatches } = require("../utils/matchingCv");

exports.getNomineeByCompanyId = async (req, res) => {
  try {
    const isAdmin = req.body.isAdmin;
    const companyId = req.body.companyId;
    const positions = await Position.find({ companyId: companyId });
    let sharedNomineesFromPosition = [];
    let title = [];

    positions.forEach((position) => {
      title.push(position.jobtitle);
      position.sharedNominees.forEach((aday) => {
        sharedNomineesFromPosition.push({
          aday: aday,
          position: { id: position._id, title: position.jobtitle },
        });
      });
    });
    let sharedNominees = [];
    await Promise.all(
      sharedNomineesFromPosition.map(async (aday) => {
        const nominee = await Nominee.findById(aday.aday);
        sharedNominees.push({ nomineeInfo: nominee, position: aday.position });
      })
    );
    let allCvs = [];
    if (isAdmin) {
      //buradaki $nin fonksiyonu sharedNominees içinde olan verilerin allCv'ye gelmemesini sağlıyor..
      allCvs = await Nominee.find({
        title: { $in: title },
        _id: { $nin: sharedNominees.map((aday) => aday._id) },
      });
    } else {
      allCvs = await Nominee.find(
        {
          title: { $in: title },
          _id: { $nin: sharedNominees.map((aday) => aday._id) }
        },

        {
          name: 0,
          contact: 0,
        }
      );
    }
    const favorites = await Customer.findById(companyId);

    res.status(200).json({
      sharedNominees: sharedNominees,
      allCvs: allCvs,
      favorites: favorites.favorites,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const nominee = req.body.nomineeId;
    const companyId = req.params.id;

    const customer = await Customer.findById(companyId);
    if (customer.favorites.includes(nominee)) {
      return res.status(400).json({ error: "Bu aday zaten favorilerde." });
    }
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      {
        $push: { favorites: [nominee] },
      },
      { new: true }
    );
    res.status(200).json(updatedCustomer);
  } catch (error) {
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

// exports.getRequestedNomineesById = async (req, res) => {
//   try {
//     const positionId = req.body.positionId;
//     const isAdmin = req.body.isAdmin;
//     const positions = await Position.findById(positionId);
//     let requestedNominees = [];

//     positions.skills.forEach((skill) => {
//       skills.push(skill);
//     });
//     positions.requestedNominees.forEach((aday) => {
//       requestedNominees.push(aday);
//     });

//     let sharedNominees = [];

//     await Promise.all(
//       sharedNomineesFromPosition.map(async (aday) => {
//         const nominee = await Nominee.findById(aday);
//         sharedNominees.push(nominee);
//       })
//     );

//     let sharedNomineesRate = findMatches(skills, sharedNominees);

//     let allCvs = [];

//     if (isAdmin) {
//       allCvs = await Nominee.find({
//         _id: { $nin: sharedNominees.map((aday) => aday._id) },
//       });
//     } else {
//       allCvs = await Nominee.find(
//         {
//           title: { $in: title },
//           _id: { $nin: sharedNominees.map((aday) => aday._id) },
//         },

//         {
//           name: 0,
//           contact: 0,
//         }
//       );
//     }

//     let suggestedAllCvs = findMatches(skills, allCvs);
//     console.log("nomienne:", suggestedAllCvs);
//     res.status(200).json({
//       sharedNominees: sharedNomineesRate,
//       suggestedAllCvs: suggestedAllCvs,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error });
//   }
// };

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
