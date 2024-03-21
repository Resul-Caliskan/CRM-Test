function findMatches(position, cvs) {
  const matchedCvs = [];

  const positionSkills = new Set(position);
  const positionSkillsLength = positionSkills.size;

  cvs.forEach((cv) => {
    const cvSkills = new Set(cv.skills);

    const commonSkills = [...positionSkills].filter((skill) =>
      cvSkills.has(skill)
    );
    const score = commonSkills.length;

    if (score > 0) {
      const matchPercentage = (score / positionSkillsLength) * 100;

      const roundedMatchPercentage = matchPercentage.toFixed(2);
      matchedCvs.push({ cv, score: roundedMatchPercentage, commonSkills });
    }
  });

  //Eşleşme puanına göre sırala, aynı puanı alanlarda deneyim süresine göre ikincil sıralama yap
  matchedCvs.sort((a, b) => {
    if (a.score !== b.score) {
      return b.score - a.score; // Puanlara göre büyükten küçüğe sırala
    } else {
      // return b.cv.experience - a.cv.experience; // Deneyim süresine göre büyükten küçüğe sırala
    }
  });

  return matchedCvs;
}

module.exports = { findMatches };