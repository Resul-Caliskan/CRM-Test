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
const AdminPositionDetail = () => {
  const [nominees, setNominees] = useState([]);
  const [suggestedNominees, setSuggestedNominees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isNomineeDetailOpen, setIsNomineeDetailOpen] = useState(false);
  const [nomineeDetail, setNomineeDetail] = useState();
  const [isKnown, setIsKnown] = useState(true);
  const [position, setPosition] = useState(null);
  const { id } = useParams();
 
  const [isOpen, setIsOpen] = useState(false);
 
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
    if (!user || user.role === null) {
      fetchData()
        .then((data) => {
          console.log("cevap:", data);
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
    fetchNominees();
  }, []);
 
  const fetchNominees = async () => {
    setLoading(true);
 
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/nominee/get-position-nominees`,
        { positionId: id, isAdmin: true }
      );
      const nomineesData = response.data.sharedNominees;
      const suggestedData = response.data.suggestedAllCvs;
      console.log("data nominees", nomineesData);
      setNominees(nomineesData);
      setSuggestedNominees(suggestedData);
 
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  const getPositionById = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/positions/${id}`
      );
      setPosition(response.data);
      return response.data;
    } catch (error) {
      console.error("Pozisyon alınırken bir hata oluştu:", error);
      return null;
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
    console.log("girdi");
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
      console.log("girdi");
      const movedNominee = suggestedNominees.find(
        (nominee) => nominee.cv._id === draggableId
      );
      if (!movedNominee) {
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
        Notification("success", `${movedNominee.cv.name} Başarıyla Eklendi`);
        console.log("respponcse add nomiee to postion ", response);
      } catch (error) {}
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
        Notification("success", `${movedNominee.cv.name} Başarıyla Silindi`);
        console.log("respponcse add nomiee to postion ", response);
      } catch (error) {}
    }
  };
 
  return (
    <>
      <NavBar />
      <div className="flex-col mx-auto px-4 py-8 ">
        <h2 className="text-center font-semibold text-xl mb-6 border-b border-gray-200 pb-2">
          {position && position.positionname} Detayı
        </h2>
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
        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 gap-3 ">
          <div className="lg:col-span-1 md:col-span-2  sm:col-span-2 min-[320px]:col-span-2">
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
                    <strong>Pozisyon Seviyesi:</strong> {position.jobtitle}
                  </p>
                  <p>
                    <strong>Deneyim Süresi:</strong> {position.experienceperiod}
                  </p>
                  <p>
                    <strong>İşyeri Politikası:</strong>{" "}
                    {position.modeofoperation}
                  </p>
 
                  <p>
                    <strong>İş Türü:</strong> {position.worktype}
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
          </div>
          {loading && <p>Veriler yükleniyor...</p>}
          {error && <p>Hata: {error}</p>}
 
          <div className="col-span-2 grid lg:grid-cols-2 md:-grid-cols-2 sm:grid-cols-2 gap-3">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="col-span-1">
                <div className="bg-white p-4 rounded border shadow">
                  <h3 className="font-semibold text-lg text-center mb-4 border-b border-gray-200 pb-2">
                    Adaylar
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
                                  <button
                                    className="absolute right-4 bottom-4   flex items-center text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                                    onClick={() =>
                                      handleNomineeDetail(nominee.cv, true)
                                    }
                                  >
                                    Detaylar{" "}
                                    <FaInfoCircle className="ml-2 size-4" />
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
              <div className="col-span-1">
                <div className="bg-white p-4 rounded border shadow">
                  <h3 className="font-semibold text-lg text-center mb-4 border-b border-gray-200 pb-2">
                    Önerilen Adaylar
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
                                <button
                                  className="absolute right-4 bottom-4   flex items-center text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                                  onClick={() =>
                                    handleNomineeDetail(nominee.cv, false)
                                  }
                                >
                                  Detaylar{" "}
                                  <FaInfoCircle className="ml-2 size-4" />
                                </button>
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
            </DragDropContext>
          </div>
          {isNomineeDetailOpen && (
            <NomineeDetail
              nominee={nomineeDetail}
              isKnown={true}
              onClose={closeNomineeDetail}
            />
          )}
        </div>
      </div>
    </>
  );
};
 
export default AdminPositionDetail;
 