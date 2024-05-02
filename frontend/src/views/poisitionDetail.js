import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css"; // Tab stillerini ekleyin
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";
import NomineeDetail from "../components/nomineeDetail";
import UserNavbar from "../components/userNavbar";
import MarkdownEditor from "@uiw/react-markdown-editor";
import CircularBar from "../components/circularBar";
import Loading from "../components/loadingComponent";
import { Empty } from "antd";
import Notification from "../utils/notification";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../utils/fetchData";
import { login } from "../redux/authSlice";
import io from 'socket.io-client';
import socket from "../config/config";
const PositionDetail = () => {
  const [nominees, setNominees] = useState([]);
  const [requestedNominees, setRequestedNominees] = useState([]);
  const [suggestedNominees, setSuggestedNominees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isNomineeDetailOpen, setIsNomineeDetailOpen] = useState(false);
  const [nomineeDetail, setNomineeDetail] = useState();
  const [isKnown, setIsKnown] = useState(true);
  const [position, setPosition] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;
  const { id } = useParams();

  useEffect(() => {

    socket.on('demandCreated', (response) => {
      // Burada requestedNominees verisini istediğiniz şekilde görüntüleyebilirsiniz
      console.log('Yeni talep oluşturuldu:', response);
      if (response.id === id) {
        console.log("burayayda geldiidii");
        setRequestedNominees(response.allCVs.requestedNominees);
        setNominees(response.allCVs.sharedNominees);
        setSuggestedNominees(response.allCVs.suggestedAllCvs);
      }
      // Örneğin, DOM manipülasyonu yaparak HTML içinde bu veriyi gösterebilirsiniz.
    });

  }, [])


  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const userSelectedOption = useSelector(
    (state) => state.userSelectedOption.userSelectedOption
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "admin") navigate("/forbidden");
    if (!user || user.role === null) {
      fetchData()
        .then((data) => {
          dispatch(login(data.user));
        })
        .catch((error) => {
          console.error(error);
        });
    }
    fetchNominees();
    fetchRequestedNominees();
    getPositionById(id);
  }, [id]);

  const fetchRequestedNominees = async () => {
    setLoading(true); // loading true olarak ayarlayın
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/nominee/get-position-nominees`,
        { positionId: id, isAdmin: false }
      );
      const nominees = response.data.sharedNominees;
      const suggested = response.data.suggestedAllCvs;
      const requested = response.data.requestedNominees;
      setNominees(nominees);
      setRequestedNominees(requested);
      setSuggestedNominees(suggested);
      console.log(nominees + " sdsds" + "sdds" + suggested);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false); // Yükleme tamamlandıktan sonra loading false olarak ayarlayın
  };

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

  const handleRequestedNominee = async (nomineeId) => {
    console.log("pozsition sid:" + id);
    try {
      const response2 = await axios.put(
        `${apiUrl}/api/positions/request/${id}`,
        { nomineeId: nomineeId }
      );



      socket.emit('createDemand', id);
      console.log("COMPAYID" + response2.data.updatedPosition.companyName);
      console.log("NAMEEE" + position.companyName);
      console.log("TİTTLLELELELE" + position.jobtitle);
      try {
        const response = await axios.post(
          `${apiUrl}/api/notification/add`,
          {
            message: response2.data.updatedPosition.companyName + " " + response2.data.updatedPosition.jobtitle + " pozisyonu için yeni aday talep etti",
            type: "nomineeDemand",
            url: `/admin-position-detail/${id}`,
            companyId: response2.data.updatedPosition.companyId,
            positionId: id,
            nomineeId: nomineeId,
            receiverCompanyId: "660688a38e88e341516e7acd"
          }
        )
        console.log("BİLDİRİM GİTTTİİİ" + response);
        socket.emit('notificationCreated', response.data.notificationId);

      } catch (error) {
        console.error(error + "bildirim iletilemedi.");
      }
      setPosition(response2.data.updatedPosition);
      fetchNominees();
      fetchRequestedNominees();
      // WebSocket bağlantısını oluştur

      Notification("success", "Aday Başarıyla Talep Edildi.");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Notification("error", "Bu Adayı Zaten Talep Ettiniz.");
      } else {
        Notification("error", "Bir hata oluştu. Lütfen tekrar deneyin.");

        console.error("Aday talep edilirken bir hata oluştu:", error.message);
      }
    }
  };

  const handleCancelRequest = async (nomineeId) => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/positions/delete-request/${id}`,
        { nomineeId: nomineeId }
      );
      setPosition(response.data);
      try {
        const response2 = await axios.delete(
          `${apiUrl}/api/notification/delete/${id}/${nomineeId}`,
        )
        console.log("Bildirim silindi:", response2.data);
        socket.emit('notificationDeleted', response2.data.notificationId);
      } catch (error) {
        console.error("Bildirim silinirken bir hata oluştu:", error);
      }
      setRequestedNominees((prevRequestedNominees) =>
        prevRequestedNominees.filter((item) => item._id !== nomineeId)
      );
      fetchNominees();
      fetchRequestedNominees();
      socket.emit('createDemand', id);
      Notification("success", "Talep Başarıyla Silindi.");
    } catch (error) {
      console.error("Talep silinirken bir hata oluştu:", error);
    }
  };

  console.log("POZİSYON BABA " + position);

  return (
    <>
      <UserNavbar />
      {loading ? (
        <Loading />
      ) : (
        <div className="body">
          <Tabs
            selectedIndex={activeTab}
            onSelect={(index) => setActiveTab(index)}
          >
            <TabList>
              <Tab>Pozisyon Detayı</Tab>
              <Tab>Paylaşılan Adaylar</Tab>
              <Tab>CV Havuzu</Tab>
              <Tab>Talep Ettiğim Adaylar</Tab>
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
                      <strong>İş Unvanı:</strong> {position.jobtitle}
                    </p>
                    <p>
                      <strong>Deneyim Süresi:</strong>{" "}
                      {position.experienceperiod}
                    </p>
                    <p>
                      <strong>Çalışma Şekli:</strong> {position.modeofoperation}
                    </p>
                    <p>
                      <strong>Sözleşme Tipi:</strong> {position.worktype}
                    </p>
                    <p>
                      <strong>İşe Başlama Tarihi:</strong>{" "}
                      {position.dateOfStart}
                    </p>
                    <p>
                      <strong className="mr-2">Tercih Edilen Sektörler:</strong>
                      <div className="inline-flex flex-wrap">
                        {position.industry &&
                          position.industry.map((sector, index) => (
                            <span key={index} className="mr-1">
                              {sector},
                            </span>
                          ))}
                      </div>
                    </p>
                    <p>
                      <strong>Adres:</strong> {position.positionAdress}{" "}
                      {position.positionCity}/{position.positionCounty}
                    </p>
                    <p>
                      <strong className="mr-2">Yasaklı Şirketler:</strong>
                      <div className="inline-flex flex-wrap">
                        {position.bannedCompanies &&
                          position.bannedCompanies.map((sector, index) => (
                            <span key={index} className="mr-2">
                              {sector}
                            </span>
                          ))}
                      </div>
                    </p>
                    <p>
                      <strong className="mr-2">Tercih Edilen Şirketler:</strong>
                      <div className="inline-flex flex-wrap">
                        {position.preferredCompanies &&
                          position.preferredCompanies.map((sector, index) => (
                            <span key={index} className="mr-2">
                              {sector}
                            </span>
                          ))}
                      </div>
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
                {!nominees.length && (
                  <div className="flex w-screen  justify-center items-center">
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  </div>
                )}
                {nominees.map((nominee, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 hover:bg-gray-200 p-4 rounded border shadow mb-4 relative"
                  >
                    <CircularBar nominee={nominee}></CircularBar>
                    <p>
                      <strong>Unvan:</strong> {nominee.cv?.title}
                    </p>
                    {nominee.cv.education.map((edu, index) => (
                      <ul key={index}>
                        <li>
                          <div>
                            <strong>Eğitim:</strong> {edu.degree}
                          </div>
                        </li>
                      </ul>
                    ))}
                    <strong>Beceriler:</strong>
                    <ul className="list-disc ml-4">
                      {nominee.cv?.skills.map((skill, index) => (
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
              {!suggestedNominees.length && (
                <div className="flex w-screen  justify-center items-center">
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </div>
              )}
              {suggestedNominees.map((nominee, index) => (
                <div
                  key={index}
                  className="bg-gray-100 hover:bg-gray-200 p-4 rounded border shadow mb-4 relative"
                >
                  <h4 className="font-semibold text-lg mb-2">Unknown</h4>
                  <p>
                    <strong>Unvan:</strong> {nominee.cv?.title}
                  </p>
                  {nominee.cv?.education.map((edu, index) => (
                    <ul key={index}>
                      <li>
                        <div>
                          <strong>Eğitim:</strong> {edu.degree}
                        </div>
                      </li>
                    </ul>
                  ))}
                  <strong>Beceriler:</strong>
                  <ul className="list-disc ml-4">
                    {nominee.cv?.skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>

                  <button
                    className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-5"
                    onClick={() => {
                      handleRequestedNominee(nominee.cv?._id);
                    }}
                  >
                    Talep Et
                  </button>

                  <button
                    className="absolute right-4 bottom-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center"
                    onClick={() => handleNomineeDetail(nominee.cv, false)}
                  >
                    Detaylar <FaInfoCircle className="ml-2 size-4" />
                  </button>
                </div>
              ))}
            </TabPanel>

            <TabPanel>
              {loading && <p>Veriler yükleniyor...</p>}
              {error && <p>Hata: {error}</p>}
              {!requestedNominees.length && (
                <div className="flex w-screen  justify-center items-center">
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </div>
              )}
              {requestedNominees.map((nominee, index) => (
                <div
                  key={index}
                  className="bg-gray-100 hover:bg-gray-200 p-4 rounded border shadow mb-4 relative"
                >
                  <h4 className="font-semibold text-lg mb-2">Unknown</h4>
                  <p>
                    <strong>Unvan:</strong> {nominee.cv?.title}
                  </p>
                  {nominee.cv?.education.map((edu, index) => (
                    <ul key={index}>
                      <li>
                        <div>
                          <strong>Eğitim:</strong> {edu.degree}
                        </div>
                      </li>
                    </ul>
                  ))}
                  <strong>Beceriler:</strong>
                  <ul className="list-disc ml-4">
                    {nominee.cv?.skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                  <button
                    className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-2"
                    onClick={() => handleCancelRequest(nominee?.cv._id)}
                  >
                    İptal Et
                  </button>
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
