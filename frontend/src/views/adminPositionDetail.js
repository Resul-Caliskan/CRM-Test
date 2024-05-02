import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";
import NomineeDetail from "../components/nomineeDetail";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../utils/fetchData";
import { login } from "../redux/authSlice";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import Notification from "../utils/notification";
import "react-circular-progressbar/dist/styles.css";
import NavBar from "../components/adminNavBar";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import CircularBar from "../components/circularBar";
import UserNavbar from "../components/userNavbar";
import Loading from "../components/loadingComponent";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Badge } from "antd";
import socket from "../config/config";


const AdminPositionDetail = () => {

  const [nominees, setNominees] = useState([]);
  const [suggestedNominees, setSuggestedNominees] = useState([]);
  const [requestedNominees, setRequestedNominees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isNomineeDetailOpen, setIsNomineeDetailOpen] = useState(false);
  const [nomineeDetail, setNomineeDetail] = useState();
  const [isKnown, setIsKnown] = useState(true);
  const [position, setPosition] = useState();
  const { id } = useParams();
  const [show, setShow] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [numOfReqNominees, setNumOfReqNominees] = useState(0);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const openNomineeDetail = () => {
    setIsNomineeDetailOpen(true);
  };

  const closeNomineeDetail = () => {
    setIsNomineeDetailOpen(false);
  };
  const navigate = useNavigate();

  useEffect(() => {

    socket.on('demandCreated', (response) => {
      // Burada requestedNominees verisini istediğiniz şekilde görüntüleyebilirsiniz
      console.log(response);
      if (response.id === id) {
        console.log("burayayda geldiidii");
        setRequestedNominees(response.allCVs.requestedNominees);
        setNominees(response.allCVs.sharedNominees);
        setSuggestedNominees(response.allCVs.suggestedAllCvs);
      }



      // Örneğin, DOM manipülasyonu yaparak HTML içinde bu veriyi gösterebilirsiniz.
    });

  }, [])
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/forbidden");
    }
    if (!user || user.role === null) {
      fetchData()
        .then((data) => {
          dispatch(login(data.user));
          if (data.user.role !== "admin") {
            navigate("/forbidden");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    getPositionById(id);
  }, [id]);



  const getPositionById = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/positions/${id}`
      );
      setPosition(response.data);
      setLoading(false);
      fetchNominees(response.data.requestedNominees);
      return response.data;
    } catch (error) {
      console.error("Error fetching position:", error);
      setError(error.message);
      setLoading(false);
      return null;
    }
  };
  const fetchNominees = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/nominee/get-position-nominees`,
        { positionId: id, isAdmin: true }
      );

      const nomineesData = response.data.sharedNominees;
      const suggestedData = response.data.suggestedAllCvs;
      const requestedNominees = response.data.requestedNominees;




      setNominees(nomineesData);
      setSuggestedNominees(suggestedData);
      setRequestedNominees(requestedNominees)
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
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

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (destination.droppableId === "nominees") {
      const movedNominee = suggestedNominees.find(
        (nominee) => nominee.cv._id === draggableId
      );
      if (!movedNominee) {
        return;
      }

      if (
        position &&
        position.bannedCompanies &&
        movedNominee.cv.experience.some((experienceItem) =>
          position.bannedCompanies.includes(experienceItem.company)
        )
      ) {
        Notification(
          "error",
          `${movedNominee.cv?.name} adlı adayın şirketi yasaklı.`
        );
        return;
      }

      const newNominees = Array.from(nominees);
      newNominees.splice(destination.index, 0, movedNominee);
      const newSuggestedNominees = suggestedNominees.filter(
        (nominee) => nominee.cv._id !== draggableId
      );

      setNominees(newNominees);
      setSuggestedNominees(newSuggestedNominees);

      try {
        const response = axios.put(
          `${process.env.REACT_APP_API_URL}/api/positions/add/${id}`,
          { nomineeId: movedNominee.cv._id }
        );
        Notification("success", `${movedNominee.cv?.name} Başarıyla Eklendi`);
        socket.emit("createDemand", id);
      } catch (error) { }
    } else if (destination.droppableId === "suggestedNominees") {
      const movedNominee = nominees.find(
        (nominee) => nominee.cv._id === draggableId
      );
      if (!movedNominee) {
        return;
      }

      const newSuggestedNominees = Array.from(suggestedNominees);
      newSuggestedNominees.splice(destination.index, 0, movedNominee);
      const newNominees = nominees.filter(
        (nominee) => nominee.cv._id !== draggableId
      );

      setSuggestedNominees(newSuggestedNominees);
      setNominees(newNominees);
      try {
        const response = axios.put(
          `${process.env.REACT_APP_API_URL}/api/positions/delete/${id}`,
          { nomineeId: movedNominee.cv._id }
        );
        Notification("success", `${movedNominee.cv?.name} Başarıyla Silindi`);
        socket.emit("createDemand", id);
      } catch (error) { }
    }
  };

  const moveNomineeToSuggested = (draggableId) => {
    const movedNominee = suggestedNominees.find(
      (nominee) => nominee.cv._id === draggableId
    );

    const newSuggestedNominees = suggestedNominees.filter(
      (nominee) => nominee.cv._id !== draggableId
    );

    const isCompanyBanned =
      position &&
      position.bannedCompanies &&
      movedNominee.cv.experience.some((experienceItem) =>
        position.bannedCompanies.includes(experienceItem.company)
      );

    if (isCompanyBanned) {
      Notification(
        "error",
        `${movedNominee.cv?.name} adlı adayın şirketi yasaklı.`
      );
      return;
    }

    const newNominees = [...nominees, movedNominee];

    setSuggestedNominees(newSuggestedNominees);
    setNominees(newNominees);

    try {
      const response = axios.put(
        `${process.env.REACT_APP_API_URL}/api/positions/add/${id}`,
        { nomineeId: movedNominee.cv._id }
      );
      Notification("success", `${movedNominee.cv?.name} Başarıyla Eklendi`);
      socket.emit("createDemand", id);
    } catch (error) { }
  };

  const moveNomineeToNominees = (draggableId) => {
    const movedNominee = nominees.find(
      (nominee) => nominee.cv._id === draggableId
    );

    const newNominees = nominees.filter(
      (nominee) => nominee.cv._id !== draggableId
    );

    setNominees(newNominees);
    setSuggestedNominees([...suggestedNominees, movedNominee]);

    try {
      const response = axios.put(
        `${process.env.REACT_APP_API_URL}/api/positions/delete/${id}`,
        { nomineeId: movedNominee.cv._id }
      );
      Notification("success", `${movedNominee.cv?.name} Başarıyla Silindi`);
      socket.emit("createDemand", id);
    } catch (error) { }
  };

  const removeNomineeFromDemanded = async (nomineeId) => {

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/positions/delete-request/${id}`,
        { nomineeId: nomineeId }

      );
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/notification/add`,
          {
            message:
              position.companyName +
              " " +
              position.jobtitle +
              " pozisyonu için talep edilen aday reddedildi.",
            type: "nomineeDemand",
            url: `/position-detail/${id}`,
            companyId: "660688a38e88e341516e7acd",
            positionId: id,
            nomineeId: nomineeId,
            receiverCompanyId: position.companyId,
          }
        );
        console.log("BİLDİRİM GİTTTİİİ" + response);
        socket.emit("notificationCreated", response.data.notificationId);
      } catch (error) {
        console.error(error + " bildirim iletilemedi.");
      }
      const movedNominee = requestedNominees.find(
        (nominee) => nominee.cv._id === nomineeId
      );
      const newNominees = requestedNominees.filter(
        (nominee) => nominee.cv._id !== nomineeId
      );
      setRequestedNominees(newNominees);
      socket.emit("createDemand", id);
      Notification("success", ` Başarıyla Silindi`);
    } catch (error) {
      Notification("error", ` İşlem gerçekleşirken bir hata oluştu.`);
    }
  }


  const acceptNomineeFromDemanded = async (nomineeId) => {
    const movedNominee = requestedNominees.find(
      (nominee) => nominee.cv._id === nomineeId
    );
    const newNominees = requestedNominees.filter(
      (nominee) => nominee.cv._id !== nomineeId
    );
    try {
      const response2 = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/positions/accept/${id}`,
        { nomineeId: nomineeId }
      );

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/notification/add`,
          {
            message:
              position.companyName +
              " " +
              position.jobtitle +
              " pozisyonu için talep edilen aday onaylandı.",
            type: "nomineeDemand",
            url: `/position-detail/${id}`,
            companyId: "660688a38e88e341516e7acd",
            positionId: id,
            nomineeId: nomineeId,
            receiverCompanyId: position.companyId,
          }
        );
        console.log("BİLDİRİM GİTTTİİİ" + response);
        socket.emit("notificationCreated", response.data.notificationId);
      } catch (error) {
        console.error(error + " bildirim iletilemedi.");
      }

      setRequestedNominees(newNominees);
      setNominees([...nominees, movedNominee]);
      socket.emit("createDemand", id);
      Notification("success", ` Başarıyla Onaylandı`);
    } catch (error) {
      Notification("error", ` onaylanırken bir hata oluştu.`);
    }
  };


  return (
    <>
      <NavBar />
      {loading && <p>Veriler yükleniyor...</p>}
      {error && <p>Hata: {error}</p>}
      {loading ? (
        <Loading />
      ) : (
        <div className="body">

          <button
            className="text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-500/30 font-medium rounded-lg text-sm px-3 py-2.5 text-center flex items-center justify-center me-2 mb-2"
            onClick={() => navigate(-1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Geri Dön
          </button>
          <Tabs>
            <TabList>
              <Tab>Pozisyon Detay</Tab>
              <Tab>Aday İşlemleri<Badge className="ml-2 mb-1" count={requestedNominees.length} /></Tab>
            </TabList>
            <TabPanel>
              {position && (
                <div className="bg-white p-4 rounded border shadow">
                  <div className="font-semibold text-lg text-center mb-2 border-b border-gray-200 pb-2">
                    Pozisyon Detayı
                  </div>
                  <div className="flex flex-col">
                    <p>
                      <strong>Departman:</strong> {position.department}
                    </p>
                    <p>
                      <strong>İş Unvanı:</strong> {position.jobtitle}
                    </p>
                    <p>
                      <strong>Deneyim Süresi:</strong> {position.experienceperiod}
                    </p>
                    <p>
                      <strong>Çalışma Şekli:</strong>{" "}
                      {position.modeofoperation}
                    </p>

                    <p>
                      <strong>Sözleşme Tipi:</strong> {position.worktype}
                    </p>

                    <p>
                      <strong>Sektör:</strong> {position.industry?.join(" ")}
                    </p>
                    <p>
                      <strong>Yasaklı Şirketler:</strong>{" "}
                      {position.bannedCompanies &&
                        position.bannedCompanies?.join(",")}
                    </p>

                    <p>
                      <strong>Tercih Edilen Şirketler:</strong>{" "}
                      {position.preferredCompanies &&
                        position.preferredCompanies?.join(",")}
                    </p>
                    <p>
                      <strong>Beceriler:</strong>

                      <ul className="list-disc ml-4 grid grid-cols-3">
                        {position.skills.map((skill, index) => (
                          <li key={index}>{skill}</li>
                        ))}
                      </ul>
                    </p>
                    <p>
                      <strong>İş Tanımı:</strong>
                      <MarkdownEditor.Markdown
                        source={position.description}
                        className="bg-gray-300"
                        style={{
                          backgroundColor: "#0000000F",
                          color: "black",
                          padding: 10,
                          borderRadius: 10,
                        }}
                      />
                    </p>
                  </div>
                </div>
              )}

            </TabPanel>
            <TabPanel>
              <div className="grid grid-cols-3 gap-7">
                <DragDropContext onDragEnd={onDragEnd}>
                  <div className="w-full">
                    <div className="bg-white  p-4 rounded border shadow">
                      <h3 className="font-semibold text-lg text-center mb-4 border-b border-gray-200 pb-2">
                        Atanan Adaylar
                      </h3>
                      {loading && <p>Veriler yükleniyor...</p>}
                      {error && <p>Hata: {error}</p>}

                      <Droppable droppableId="nominees">
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.droppableProps}>
                            {nominees.map((nominee, index) => (
                              <Draggable
                                key={nominee.cv._id}
                                draggableId={nominee.cv._id}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <div className="bg-gray-100 hover:bg-gray-200 p-4 rounded border shadow mb-4 relative">
                                      <CircularBar nominee={nominee}></CircularBar>

                                      <p>
                                        <strong>Unvan:</strong> {nominee.cv.title}
                                      </p>
                                      {nominee.cv.education.map((edu, index) => (
                                        <ul>
                                          <li key={index}>
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
                                      <div className="flex gap-5 mt-1 w-full h-[40px] items-center justify-end ">
                                        <button
                                          className="right-4 bottom-20 flex items-center text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                          onClick={() =>
                                            moveNomineeToNominees(nominee.cv._id)
                                          }
                                        >
                                          Çıkar
                                        </button>
                                        <button
                                          className=" right-4 bottom-4   flex items-center text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                                          onClick={() =>
                                            handleNomineeDetail(nominee.cv, true)
                                          }
                                        >
                                          Detaylar{" "}
                                          {/* <FaInfoCircle className="ml-2 size-4" /> */}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </div>
                  <div className="col-span-1 ">
                    <div className="bg-white p-4 rounded border shadow">
                      <h3 className="font-semibold text-lg text-center mb-4 border-b border-gray-200 pb-2">
                        CV Havuzu
                      </h3>
                      <Droppable droppableId="suggestedNominees">
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.droppableProps}>
                            {suggestedNominees.map((nominee, index) => (
                              <Draggable
                                key={nominee.cv._id}
                                draggableId={nominee.cv._id}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
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
                                    <div className="flex gap-5 mt-1 w-full h-[40px] items-center justify-end ">
                                      <button
                                        className=" right-4 bottom-20 flex items-center text-white bg-gradient-to-r from-yellow-400 to-yellow-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                                        onClick={() =>
                                          moveNomineeToSuggested(nominee.cv._id)
                                        }
                                      >
                                        Ekle
                                      </button>
                                      <button
                                        className=" right-4 bottom-4   flex items-center text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                                        onClick={() =>
                                          handleNomineeDetail(nominee.cv, false)
                                        }
                                      >
                                        Detaylar{" "}
                                        {/* <FaInfoCircle className="ml-2 size-4" /> */}
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                    </div>
                  </div>
                  <div className="col-span-1 ">
                    <div className="bg-white p-4 rounded border shadow">
                      <h3 className="font-semibold text-lg text-center mb-4 border-b border-gray-200 pb-2">
                        Talep Edilen Adaylar
                      </h3>
                      <div >
                        {requestedNominees.map((nominee, index) => (
                          <div

                            className="bg-gray-100 hover:bg-gray-200 p-4 rounded border shadow mb-4 relative"
                          >
                            <CircularBar nominee={nominee}></CircularBar>

                            <p>
                              <strong>Unvan:</strong> {nominee.cv?.title}
                            </p>
                            {nominee.cv?.education.map((edu, index) => (
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
                              {nominee.cv?.skills.map((skill, index) => (
                                <li key={index}>{skill}</li>
                              ))}
                            </ul>
                            <div className="flex gap-5 mt-1 w-full h-[40px] items-center justify-end ">
                              <button
                                className=" right-4 bottom-20 flex items-center text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                onClick={() =>
                                  removeNomineeFromDemanded(nominee.cv._id)
                                }
                              >
                                Sil
                              </button>
                              <button
                                className=" right-4 bottom-20 flex items-center text-white bg-gradient-to-r from-green-500 to-green-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                                onClick={() =>
                                  acceptNomineeFromDemanded(nominee.cv._id)
                                }
                              >
                                Onayla
                              </button>

                              <button
                                className="    flex items-center text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                                onClick={() =>
                                  handleNomineeDetail(nominee.cv, false)
                                }
                              >
                                Detaylar{" "}
                                {/* <FaInfoCircle className="ml-2 size-4" /> */}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </DragDropContext>
              </div>

            </TabPanel>
            {isNomineeDetailOpen && (
              <NomineeDetail
                nominee={nomineeDetail}
                isKnown={true}
                onClose={closeNomineeDetail}
              />
            )}

          </Tabs>
        </div>
      )}
    </>
  );
};

export default AdminPositionDetail;