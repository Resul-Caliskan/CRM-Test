const Position=require("../models/position");
const Nominee=require("../models/nominee");
const { findMatches } = require("./matchingCv");
 async function  getNominees  (positionId,isAdmin) {
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
    return {sharedNominees:sharedNomineesRate,suggestedAllCvs:suggestedAllCvs,requestedNominees:requestedCv}
}
module.exports={getNominees};