import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css"; // Tab stillerini ekleyin
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";
import NomineeDetail from "../components/nomineeDetail";
import UserNavbar from "../components/userNavbar";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import CircularBar from "../components/circularBar";
import Loading from "../components/loadingComponent";

const PositionDetail = () => {
  const [nominees, setNominees] = useState([]);
  const [suggestedNominees, setSuggestedNominees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isNomineeDetailOpen, setIsNomineeDetailOpen] = useState(false);
  const [nomineeDetail, setNomineeDetail] = useState();
  const [isKnown, setIsKnown] = useState(true);
  const [position, setPosition] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;
  const { id } = useParams();

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    fetchNominees();
    getPositionById(id);
  }, [id]);

  const fetchNominees = async () => {
    setLoading(true); // loading true olarak ayarlayın
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/nominee/get-position-nominees`,
        { positionId: id, isAdmin: false }
      );
      const nominees = response.data.sharedNominees;
      const suggested = response.data.suggestedAllCvs;
      setNominees(nominees);
      setSuggestedNominees(suggested);
      console.log(nominees + " sdsds" + "sdds" + suggested);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false); // Yükleme tamamlandıktan sonra loading false olarak ayarlayın
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

  const getPositionById = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/api/positions/${id}`);
      setPosition(response.data);
      return response.data;
    } catch (error) {
      console.error("Pozisyon alınırken bir hata oluştu:", error);
      return null;
    }
  };

  const openNomineeDetail = () => {
    setIsNomineeDetailOpen(true);
  };

  const closeNomineeDetail = () => {
    setIsNomineeDetailOpen(false);
  };

  return (
    <>
      <UserNavbar />
      {loading ? (
        <Loading />
      ) : (
        <div className="flex-col mx-auto px-4 py-8 ">
          <Tabs>
            <TabList>
              <Tab>Pozisyon Detayı</Tab>
              <Tab>Adaylar</Tab>
              <Tab>Önerilen Adaylar</Tab>
            </TabList>

            <TabPanel>
              {position && (
                <div className="bg-white p-4 rounded border shadow">
                  <div className="font-semibold text-lg text-center mb-2 border-b border-gray-200 pb-2">
                    Pozisyon Detayı
                  </div>
                  <div className="grid grid-cols-3">
                    <p>
                      <strong>Departman:</strong> {position.department}
                    </p>
                    <p>
                      <strong>Pozisyon Seviyesi:</strong> {position.jobtitle}
                    </p>
                    <p>
                      <strong>Deneyim Süresi:</strong>{" "}
                      {position.experienceperiod}
                    </p>
                    <p>
                      <strong>İşyeri Politikası:</strong>{" "}
                      {position.modeofoperation}
                    </p>
                    <p>
                      <strong>İş Türü:</strong> {position.worktype}
                    </p>
                    <div className="col-span-3 p-5">
                      <MarkdownEditor.Markdown
                        style={{
                          backgroundColor: "#0000000F",
                          color: "black",
                          borderRadius: 8,
                          padding: 20,
                        }}
                        source={position.description}
                      ></MarkdownEditor.Markdown>
                    </div>
                  </div>
                </div>
              )}
            </TabPanel>
            <TabPanel>
              {loading && <p>Veriler yükleniyor...</p>}
              {error && <p>Hata: {error}</p>}
              <div className="grid grid-cols-3 gap-2">
                {nominees.map((nominee, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 hover:bg-gray-200 p-4 rounded border shadow mb-4 relative"
                  >
                    <CircularBar nominee={nominee}></CircularBar>
                    <p>
                      <strong>Unvan:</strong> {nominee.cv.title}
                    </p>
                    {nominee.cv.education.map((edu, index) => (
                      <ul key={index}>
                        <li>
                          <div>
                            <strong>Degree:</strong> {edu.degree}
                          </div>
                        </li>
                      </ul>
                    ))}
                    <strong>Skills:</strong>
                    <ul className="list-disc ml-4">
                      {nominee.cv.skills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                    <button
                      className="absolute right-4 bottom-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center"
                      onClick={() => handleNomineeDetail(nominee.cv, true)}
                    >
                      Detaylar <FaInfoCircle className="ml-2 size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </TabPanel>
            <TabPanel>
              {loading && <p>Veriler yükleniyor...</p>}
              {error && <p>Hata: {error}</p>}
              {suggestedNominees.map((nominee, index) => (
                <div
                  key={index}
                  className="bg-gray-100 hover:bg-gray-200 p-4 rounded border shadow mb-4 relative"
                >
                  <h4 className="font-semibold text-lg mb-2">Unknown</h4>
                  <p>
                    <strong>Unvan:</strong> {nominee.cv.title}
                  </p>
                  {nominee.cv.education.map((edu, index) => (
                    <ul key={index}>
                      <li>
                        <div>
                          <strong>Degree:</strong> {edu.degree}
                        </div>
                      </li>
                    </ul>
                  ))}
                  <strong>Skills:</strong>
                  <ul className="list-disc ml-4">
                    {nominee.cv.skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                  <button
                    className="absolute right-4 bottom-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center"
                    onClick={() => handleNomineeDetail(nominee.cv, false)}
                  >
                    Detaylar <FaInfoCircle className="ml-2 size-4" />
                  </button>
                </div>
              ))}
            </TabPanel>
          </Tabs>
          {isNomineeDetailOpen && (
            <NomineeDetail
              nominee={nomineeDetail}
              isKnown={isKnown}
              onClose={closeNomineeDetail}
            />
          )}
        </div>
      )}
    </>
  );
};

export default PositionDetail;
