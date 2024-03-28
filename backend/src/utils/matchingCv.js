function findMatches(position, cvs) {
  const matchedCvs = [];

  const positionSkills = new Set(position.map((skill) => skill.toLowerCase()));
  const positionSkillsLength = positionSkills.size;

  cvs.forEach((cv) => {
    const cvSkills = new Set(cv.skills.map((skill) => skill.toLowerCase()));

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

  matchedCvs.sort((a, b) => {
    if (a.score !== b.score) {
      return b.score - a.score;
    } else {
      // If scores are equal, sort by experience
      //return b.cv.experience - a.cv.experience;
    }
  });

  return matchedCvs;
}

module.exports = { findMatches };
