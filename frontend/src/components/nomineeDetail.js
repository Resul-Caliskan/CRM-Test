export default function NomineeDetail({ nominee, onClose, isKnown }) {
    if (!nominee) {
        console.log(isKnown);
        return null;
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-gray-300 bg-opacity-75">
            <div className="bg-white p-4 rounded border shadow max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between border-b-2 border-gray-200 pb-2">
                    <div className="font-semibold text-lg  mb-2 ">{isKnown ? <h3>{nominee.name}</h3> : <h3>Unknown</h3>}</div>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-800 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex flex-col pt-2">
                    <p><strong>Title:</strong> {nominee.title}</p>
                    {isKnown && <p><strong>Email:</strong> {nominee.contact.email}</p>}
                    {isKnown && <p><strong>Phone:</strong> {nominee.contact.phone}</p>}
                    {isKnown && <p><strong>LinkedIn:</strong> {nominee.contact.linkedin}</p>}
                    <div className="mt-3">
                        <strong>Skills:</strong>
                        <ul className="list-disc ml-4">
                            {nominee.skills.map((skill, index) => (
                                <li key={index}>{skill}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-3">
                        <strong>Experience:</strong>
                        <ul className="list-disc ml-4">
                            {nominee.experience.map((exp, index) => (
                                <li key={index}>
                                    <div><strong>Position:</strong> {exp.position}</div>
                                    <div><strong>Company:</strong> {exp.company}</div>
                                    <div><strong>Duration:</strong> {exp.duration}</div>
                                    <div><strong>Description:</strong> {exp.description}</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-3">
                        <strong>Education:</strong>
                        <ul className="list-disc ml-4">
                            {nominee.education.map((edu, index) => (
                                <li key={index}>
                                    <div><strong>Degree:</strong> {edu.degree}</div>
                                    <div><strong>University:</strong> {edu.university}</div>
                                    <div><strong>Graduation Year:</strong> {edu.graduation_year}</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
