import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NomineeDetail from "../components/nomineeDetail";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../utils/fetchData";
import { login } from "../redux/authSlice";
import { DragDropContext } from "react-beautiful-dnd";
import Notification from "../utils/notification";
import "react-circular-progressbar/dist/styles.css";
import NavBar from "../components/adminNavBar";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Loading from "../components/loadingComponent";
import { Badge, Button } from "antd";
import socket from "../config/config";
import NomineeList from "../components/NomineeList";
import RequestedNomineeList from "../components/RequestedNomineesList";
import { useTranslation } from "react-i18next";

const AdminPositionDetail = () => {
  const { t } = useTranslation();
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
  const [selectedTab, setSelectedTab] = useState(0);
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
  const handleTabChange = (index) => {
    setSelectedTab(index);
  };
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("demandCreated", (response) => {
      if (response.id === id) {
        setRequestedNominees(response.allCVs.requestedNominees);
        setNominees(response.allCVs.sharedNominees);
        setSuggestedNominees(response.allCVs.suggestedAllCvs);
      }
    });
  }, []);
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
      setRequestedNominees(requestedNominees);
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
          `${movedNominee.cv?.name} ${t(
            "admin_detail.candidate_banned_company"
          )}`
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
        Notification(
          "success",
          `${movedNominee.cv?.name} ${t("admin_detail.added_success")}`
        );
        socket.emit("createDemand", id);
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
        Notification(
          "success",
          `${movedNominee.cv?.name} ${t("admin_detail.removed_success")}`
        );
        socket.emit("createDemand", id);
      } catch (error) {}
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
        `${movedNominee.cv?.name}  ${t(
          "admin_detail.candidate_banned_company"
        )}`
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
      Notification(
        "success",
        `${movedNominee.cv?.name} ${t("admin_detail.added_success")}`
      );
      socket.emit("createDemand", id);
    } catch (error) {}
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
      Notification(
        "success",
        `${movedNominee.cv?.name}${t("admin_detail.removed_success")}`
      );
      socket.emit("createDemand", id);
    } catch (error) {}
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
             {
              tr_message:
                position.jobtitle +
                " pozisyonu için talep ettiğiniz aday reddedildi.",

              en_message:
                "The candidate that you requested for " +
                position.jobtitle +
                " was rejected.",
            },
            type: "nomineeDemand",
            url: `/position-detail/${id}`,
            companyId: "660688a38e88e341516e7acd",
            positionId: id,
            nomineeId: nomineeId,
            receiverCompanyId: position.companyId,
          }
        );
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
      Notification("success", ` ${t("admin_detail.removed_success")}`);
    } catch (error) {
      Notification("error", `  ${t("admin_detail.removed_error")}`);
    }
  };

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
            message: {
              tr_message:
                position.jobtitle +
                " pozisyonu için talep ettiğiniz aday onaylandı.",

              en_message:
                "The candidate that you requested for " +
                position.jobtitle +
                " was approved ",
            },
            type: "nomineeDemand",
            url: `/position-detail/${id}`,
            companyId: "660688a38e88e341516e7acd",
            positionId: id,
            nomineeId: nomineeId,
            receiverCompanyId: position.companyId,
          }
        );
        socket.emit("notificationCreated", response.data.notificationId);
      } catch (error) {
        console.error(error + " bildirim iletilemedi.");
      }

      setRequestedNominees(newNominees);
      setNominees([...nominees, movedNominee]);
      socket.emit("createDemand", id);
      Notification("success", ` ${t("admin_detail.approve")}`);
    } catch (error) {
      Notification("error", `  ${t("admin_detail.approve_error")}`);
    }
  };

  return (
    <>
      <NavBar />
      {loading ? (
        <Loading />
      ) : (
        <div className="body">
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
          >
            {t("admin_detail.back")}
          </Button>
          {/* TABS DIV */}
          <div className="flex w-full bg-white h-[71px] justify-start items-center rounded-2xl">
            <div className="flex flex- row justify-start items-center ml-2">
              <button
                className={`flex items-center justify-center m-2 ${
                  selectedTab === 0 ? "border-b-2 pb-1 border-blue-400" : ""
                } `}
                onClick={() => handleTabChange(0)}
              >
                {t("admin_detail.position_detail")}
              </button>
              <button
                className={`flex items-center justify-center m-2 ${
                  selectedTab === 1 ? "border-b-2 pb-1 border-blue-400" : ""
                } `}
                onClick={() => handleTabChange(1)}
              >
                {t("admin_detail.nominee_operations")}
                {requestedNominees.length !== 0 && (
                  <Badge
                    className="ml-2 mb-1"
                    count={requestedNominees.length}
                  />
                )}
              </button>
            </div>
          </div>
          <div className="w-full justify-between items-center ">
            {selectedTab === 0 && (
              <>
                {" "}
                <div className="flex relative">
                  <div className="w-[255px] rounded-xl bg-white p-4">
                    <div className="flex flex-col gap-2  text-sm font-thin">
                    <p>
                        <strong className="font-semibold">
                          {t("admin_detail.company_name")}:{" "}
                        </strong>
                        {position?.companyName}
                      </p>
                      <p>
                        <strong className="font-semibold">
                          {t("admin_detail.department")}:{" "}
                        </strong>
                        {position?.department}
                      </p>
                      <p>
                        <strong className="font-semibold">
                          {t("admin_detail.job_title")}:
                        </strong>{" "}
                        {position?.jobtitle}
                      </p>
                      <p>
                        <strong className="font-semibold">
                          {t("admin_detail.experience_period")}:
                        </strong>
                        {position?.experienceperiod}
                      </p>
                      <p>
                        <strong className="font-semibold">
                          {t("admin_detail.working_mode")}:
                        </strong>{" "}
                        {position?.modeofoperation}
                      </p>
                      <p>
                        <strong className="font-semibold">
                          {t("admin_detail.contract_type")}:
                        </strong>{" "}
                        {position?.worktype}
                      </p>
                      <p>
                        <strong className="font-semibold">
                          {t("admin_detail.preferred_industries")}:
                        </strong>{" "}
                        {position?.industry && position?.industry?.join(", ")}
                      </p>
                      <p>
                        <strong className="font-semibold">
                          {t("admin_detail.banned_companies")}:
                        </strong>{" "}
                        {position?.bannedCompanies &&
                          position?.bannedCompanies?.join(", ")}{" "}
                      </p>
                      <p>
                        <strong className="font-semibold">
                          {t("admin_detail.preferred_companies")}:
                        </strong>{" "}
                        {position?.preferredCompanies &&
                          position?.preferredCompanies?.join(", ")}{" "}
                      </p>
                      <div className="w-[207px] h-[1px] bg-[#E8E8E8]"></div>
                      <p>
                        <strong className="font-semibold">
                          {t("admin_detail.skills")}:
                        </strong>
                        <ul className="list-disc ml-4 mt-1 grid grid-cols-2 font-thin ">
                          {position?.skills.map((skill, index) => (
                            <li key={index}>{skill}</li>
                          ))}
                        </ul>
                      </p>
                    </div>
                  </div>
                  <div class="w-full rounded-xl bg-white p-4 ml-5">
                    <p>
                      <MarkdownEditor.Markdown
                        source={position?.description}
                        style={{
                          backgroundColor: "#00000000",
                          color: "black",
                          padding: 10,
                          fontWeight: 200,
                          fontSize: 14,
                          borderRadius: 10,
                        }}
                      />
                    </p>
                  </div>
                </div>
              </>
            )}
            {selectedTab === 1 && (
              <>
                {" "}
                <div className="flex justify-around items-center ">
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 xl:grid-cols-3 xl:gap-12">
                    <DragDropContext onDragEnd={onDragEnd}>
                      <NomineeList
                        currentNominees={nominees}
                        removeNominee={moveNomineeToNominees}
                        handleNomineeDetail={handleNomineeDetail}
                        addNominee={moveNomineeToSuggested}
                        droppableId={"nominees"}
                      />
                      <NomineeList
                        currentNominees={suggestedNominees}
                        removeNominee={moveNomineeToNominees}
                        handleNomineeDetail={handleNomineeDetail}
                        addNominee={moveNomineeToSuggested}
                        isTarget={false}
                        droppableId={"suggestedNominees"}
                      />
                      <RequestedNomineeList
                        requestedNominees={requestedNominees}
                        removeNomineeFromDemanded={removeNomineeFromDemanded}
                        acceptNomineeFromDemanded={acceptNomineeFromDemanded}
                        handleNomineeDetail={handleNomineeDetail}
                      />
                    </DragDropContext>
                  </div>
                </div>
              </>
            )}

            {isNomineeDetailOpen && (
              <NomineeDetail
                nominee={nomineeDetail}
                isKnown={true}
                onClose={closeNomineeDetail}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPositionDetail;
