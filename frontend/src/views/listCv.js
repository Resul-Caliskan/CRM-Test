import React, { useState, useEffect } from "react";
import axios from "axios";
import { getIdFromToken } from "../utils/getIdFromToken";
import filterCandidates from "../utils/searchCv";
import { FaInfoCircle } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import NomineeDetail from "../components/nomineeDetail";
import SearchInput from "../components/searchInput"; // Dikkat edin: Büyük harfle başlamalı
import Highlighter from "react-highlight-words";

const CVList = () => {
  const [sharedItems, setSharedItems] = useState([]);
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCV, setSelectedCV] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Başlangıç değeri belirlendi
  const companyId = getIdFromToken(localStorage.getItem("token"));
  const [isNomineeDetailOpen, setIsNomineeDetailOpen] = useState(false);
  const [nomineeDetail, setNomineeDetail] = useState();
  const [isKnown, setIsKnown] = useState(true);
  const [inputValue, setInputValue] = useState(searchTerm);

  const openNomineeDetail = () => {
    setIsNomineeDetailOpen(true);
  };

  const closeNomineeDetail = () => {
    setIsNomineeDetailOpen(false);
  };
  
  const filterCandidates = (candidates, shared, term) => {
    if (!term) return candidates; // Add this line to check if 'term' is defined
    // Rest of your filtering logic...
  };

  useEffect(() => {
    fetchCVs();
  }, []);

  const fetchCVs = async () => {
    setLoading(true);
    try {
      const postResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/nominee/adayuser`,
        { companyId: companyId }
      );

      const shared = postResponse.data.sharedNominees;
      const cvHavuzu = postResponse.data.allCv;
      console.log("AAAAAAA" + cvHavuzu);
      setSharedItems(shared);
      setCvs(cvHavuzu);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleNomineeDetail = (nominee, isKnown) => {
    if (nominee && nominee._id) {
      setIsKnown(isKnown);
      setNomineeDetail(nominee);
      openNomineeDetail();
    } else {
      console.error(
        "Pozisyon detayları alınamadı: Pozisyon bilgileri eksik veya geçersiz."
      );
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  return (
    <div>
      <div>
        <SearchInput

          searchTerm={searchTerm.toLowerCase()} // searchTerm'i küçük harfe çevirme işlemi burada gerçekleştirilecek
          onSearch={handleSearch}
        />
      </div>
      <div className="flex">
        <div className="w-1/2 p-4 border-r-2 border-">
          <h2 className="text-center font-semibold text-xl mb-6">
            {" "}
            BENİMLE PAYLAŞILANLAR
          </h2>
          <ul>
            {filterCandidates(sharedItems, true, searchTerm).map(
              (nominee, index) => (
                <div
                  key={index}
                  className="bg-lime-100 hover:bg-lime-200 duration-150 p-4 rounded border shadow mb-4 relative"
                >
                  <h4 className="font-semibold text-lg mb-2 ">
                    <Highlighter
                      highlightClassName="highlighted"
                      searchWords={[searchTerm]}
                      autoEscape={true}
                      textToHighlight={nominee.name ||''}
                    />
                  </h4>

                  <p>
                    <strong>Unvan:</strong>
                    <Highlighter
                      highlightClassName="highlighted"
                      searchWords={[searchTerm]}
                      autoEscape={true}
                      textToHighlight={nominee.title ||''}
                    />
                  </p>
                  {nominee.education.map((edu, index) => (
                    <ul>
                      <li key={index}>
                        <div>
                          <strong>Degree:</strong>
                          <Highlighter
                            highlightClassName="highlighted"
                            searchWords={[searchTerm]}
                            autoEscape={true}
                            textToHighlight={edu.degree ||''}
                          />
                        </div>
                      </li>
                    </ul>
                  ))}
                  <strong>Skills:</strong>
                  <ul className="list-disc ml-4">
                    {nominee.skills.map((skill, index) => (
                      <li key={index}>
                        <Highlighter
                          highlightClassName="highlighted"
                          searchWords={[searchTerm]}
                          autoEscape={true}
                          textToHighlight={skill ||''}
                        />
                      </li>
                    ))}
                  </ul>
                  <button
                    className="absolute right-4 bottom-4 bg-indigo-500 hover:bg-indigo-700 transition duration-150 ease-in-out text-white font-bold py-2 px-4 rounded flex items-center"
                    onClick={() => handleNomineeDetail(nominee, true)}
                  >
                    Detaylar <FaInfoCircle className="ml-2 size-4" />
                  </button>
                </div>
              )
            )}
          </ul>
        </div>
        <div className="w-px bg-gray-300 h-full"></div>
        <div className="w-1/2 p-4">
          <h2 className="text-center font-semibold text-xl mb-6">CV HAVUZU</h2>
          <div className="grid grid-cols-1 gap-4">
            {filterCandidates(cvs, false, searchTerm).map((nominee, index) => (
              <div
                key={index}
                className="bg-gray-100 hover:bg-gray-200 p-4 rounded border shadow mb-4 relative"
              >
                <h4 className="font-semibold text-lg mb-2">Unknown</h4>
                <p>
                  <strong>Unvan:</strong>
                  <Highlighter
                    highlightClassName="highlighted"
                    searchWords={[searchTerm]}
                    autoEscape={true}
                    textToHighlight={nominee.title ||''}
                  />
                </p>
                {nominee.education.map((edu, index) => (
                  <ul>
                    <li key={index}>
                      <div>
                        <strong>Degree:</strong>
                        <Highlighter
                          highlightClassName="highlighted"
                          searchWords={[searchTerm]}
                          autoEscape={true}
                          textToHighlight={edu.degree ||''}
                        />
                      </div>
                    </li>
                  </ul>
                ))}
                <strong>Skills:</strong>
                <ul className="list-disc ml-4">
                  {nominee.skills.map((skill, index) => (
                    <li key={index}>
                      <Highlighter
                        highlightClassName="highlighted"
                        searchWords={[searchTerm]}
                        autoEscape={true}
                        textToHighlight={skill ||''}
                      />
                    </li>
                  ))}
                </ul>
                <button
                  className="absolute right-4 bottom-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center"
                  onClick={() => handleNomineeDetail(nominee, false)}
                >
                  Detaylar <FaInfoCircle className="ml-2 size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        {isNomineeDetailOpen && (
          <NomineeDetail
            className="duration-1000"
            nominee={nomineeDetail}
            isKnown={isKnown}
            onClose={closeNomineeDetail}
          />
        )}
      </div>
    </div>
  );
};

export default CVList;
