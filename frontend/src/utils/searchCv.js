const filterCandidates = (candidates,isNormal,searchTerm) => {
    return candidates.filter(candidate => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        // Check name
        if (candidate.name.toLowerCase().includes(lowerCaseSearchTerm&& isNormal)) {
            return true;
        }

        // Check title
        if (candidate.title.toLowerCase().includes(lowerCaseSearchTerm)) {
            return true;
        }

        // Check contact details
        if (
           ( candidate.contact.email.toLowerCase().includes(lowerCaseSearchTerm) ||
            candidate.contact.phone.includes(searchTerm) ||
            candidate.contact.linkedin.toLowerCase().includes(lowerCaseSearchTerm))&& isNormal
        ) {
            return true;
        }

        // Check skills
        if (candidate.skills.some(skill => skill.toLowerCase().includes(lowerCaseSearchTerm))) {
            return true;
        }

        // Check experience
        if (
            candidate.experience.some(exp =>
                exp.position.toLowerCase().includes(lowerCaseSearchTerm) ||
                exp.company.toLowerCase().includes(lowerCaseSearchTerm) ||
                exp.duration.includes(searchTerm) ||
                exp.description.toLowerCase().includes(lowerCaseSearchTerm)
            )
        ) {

            return true;
        }

        // Check education
        if (
            candidate.education.some(edu =>
                edu.degree.toLowerCase().includes(lowerCaseSearchTerm) ||
                edu.university.toLowerCase().includes(lowerCaseSearchTerm) ||
                edu.graduation_year.toString().includes(searchTerm)
            )
        ) {
            return true;
        }

        return false;
    });
};

export default filterCandidates;


