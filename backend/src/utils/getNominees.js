const Position=require("../models/position");
const Nominee=require("../models/nominee");
const { findMatches } = require("./matchingCv");
 async function  getNominees  (positionId,isAdmin) {
    const positions = await Position.findById(positionId);

    let sharedNomineesFromPosition = [];
    let skills = [];
    let requestedNominees=[];

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

    

    let requestedCv = findMatches(skills, requestedNominees);
    return {sharedNominees:sharedNomineesRate,requestedNominees:requestedCv}
}
module.exports={getNominees};