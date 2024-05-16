import React, { useEffect, useState } from "react";
import "react-tabs/style/react-tabs.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import NomineeDetail from "../components/nomineeDetail";
import UserNavbar from "../components/userNavbar";
import MarkdownEditor from "@uiw/react-markdown-editor";
import CircularBar from "../components/circularBar";
import Loading from "../components/loadingComponent";
import { Button, Empty, Spin } from "antd";
import Notification from "../utils/notification";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../utils/fetchData";
import { login } from "../redux/authSlice";
import socket from "../config/config";
import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const PositionDetail = () => {
  const { t } = useTranslation();
  const [nominees, setNominees] = useState([]);
  const [requestedNominees, setRequestedNominees] = useState([]);
  const [suggestedNominees, setSuggestedNominees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonLoadingList, setButtonLoadingList] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isNomineeDetailOpen, setIsNomineeDetailOpen] = useState(false);
  const [nomineeDetail, setNomineeDetail] = useState();
  const [isKnown, setIsKnown] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [position, setPosition] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;
  const { id } = useParams();

  useEffect(() => {
    socket.on("demandCreated", (response) => {
      if (response.id === id) {
        setRequestedNominees(response.allCVs.requestedNominees);
        setNominees(response.allCVs.sharedNominees);
        setSuggestedNominees(response.allCVs.suggestedAllCvs);
      }
    });
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const handleTabChange = (index) => {
    setSelectedTab(index);
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
    setLoading(true);
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
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const fetchNominees = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/nominee/get-position-nominees`,
        { positionId: id, isAdmin: false }
      );
      const nominees = response.data.sharedNominees;
      const suggested = response.data.suggestedAllCvs;
      setNominees(nominees);
      setSuggestedNominees(suggested);
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

  const handleRequestedNominee = async (nomineeId, index) => {
    const newButtonLoadingList = [...buttonLoadingList];
    newButtonLoadingList[index] = true;
    setButtonLoadingList(newButtonLoadingList);
    try {
      const response2 = await axios.put(
        `${apiUrl}/api/positions/request/${id}`,
        { nomineeId: nomineeId }
      );

      socket.emit("createDemand", id);
      try {
        const response = await axios.post(`${apiUrl}/api/notification/add`, {
          message: {
            tr_message:
              response2.data.updatedPosition.companyName +
              " " +
              response2.data.updatedPosition.jobtitle +
              " pozisyonu için yeni aday talep etti",
            en_message:
              response2.data.updatedPosition.companyName +
              " has requested new candidate for " +
              response2.data.updatedPosition.jobtitle +
              " position",
          },

          type: "nomineeDemand",
          url: `/admin-position-detail/${id}`,
          companyId: response2.data.updatedPosition.companyId,
          positionId: id,
          nomineeId: nomineeId,
          receiverCompanyId: "660688a38e88e341516e7acd",
        });
        socket.emit("notificationCreated", response.data.notificationId);
      } catch (error) {
        console.error(error + "bildirim iletilemedi.");
      }
      setPosition(response2.data.updatedPosition);
      fetchNominees();
      fetchRequestedNominees();
      Notification("success", t("position_detail.request_success"));
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Notification("error", t("position_detail.requested_already"));
      } else {
        Notification("error", t("position_detail.request_error"));

        console.error(
          t("position_detail.requestCandidate_error"),
          error.message
        );
      }
    } finally {
      // Yükleme durumunu sıfırla
      newButtonLoadingList[index] = false;
      setButtonLoadingList(newButtonLoadingList);
    }
  };

  const handleCancelRequest = async (nomineeId, index) => {
    const newButtonLoadingList = [...buttonLoadingList];
    newButtonLoadingList[index] = true;
    setButtonLoadingList(newButtonLoadingList);
    try {
      const response = await axios.put(
        `${apiUrl}/api/positions/delete-request/${id}`,
        { nomineeId: nomineeId }
      );
      setPosition(response.data);
      try {
        const response2 = await axios.delete(
          `${apiUrl}/api/notification/delete/${id}/${nomineeId}`
        );
        socket.emit("notificationDeleted", response2.data.notification);
      } catch (error) {
        console.error(t("position_detail.notification_error"), error);
      }
      setRequestedNominees((prevRequestedNominees) =>
        prevRequestedNominees.filter((item) => item._id !== nomineeId)
      );
      fetchNominees();
      fetchRequestedNominees();
      socket.emit("createDemand", id);
      Notification("success", t("position_detail.requestCancel_success"));
    } catch (error) {
      console.error(t("position_detail.requestCancel_error"), error);
    } finally {
      // Yükleme durumunu sıfırla
      newButtonLoadingList[index] = false;
      setButtonLoadingList(newButtonLoadingList);
    }
  };

  return (
    <div className="h-screen">
      <UserNavbar />
      {loading ? (
        <Loading />
      ) : (
        <div className="body">
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
          >
            {t("position_detail.back")}
          </Button>
          <div className="flex w-full bg-white h-[71px] justify-start items-center rounded-2xl">
            <div className="flex flex-row justify-start items-center ml-2">
              <button
                className={`flex items-center justify-center border-b-2 m-2 ${
                  selectedTab === 0
                    ? "border-b-2  border-blue-400"
                    : "border-white"
                } `}
                onClick={() => handleTabChange(0)}
              >
                {t("position_detail.tab_detail")}
              </button>
              <button
                className={`flex items-center justify-center border-b-2 m-2 ${
                  selectedTab === 1
                    ? "border-b-2  border-blue-400"
                    : "border-white"
                } `}
                onClick={() => handleTabChange(1)}
              >
                {t("position_detail.tab_shared")}
              </button>
              <button
                className={`flex items-center justify-center border-b-2 m-2 ${
                  selectedTab === 2
                    ? "border-b-2  border-blue-400"
                    : "border-white"
                } `}
                onClick={() => handleTabChange(2)}
              >
                {t("position_detail.tab_pool")}
              </button>
              <button
                className={`flex items-center justify-center border-b-2 m-2 ${
                  selectedTab === 3
                    ? "border-b-2  border-blue-400"
                    : "border-white"
                } `}
                onClick={() => handleTabChange(3)}
              >
                {t("position_detail.tab_requested")}
              </button>
            </div>
          </div>
          <div className="h-screen w-full justify-center items-cente">
            {selectedTab === 0 && (
              <>
                <div className="flex absolute">
                  <div className="w-[255px] rounded-xl bg-white p-4">
                    <div className="flex flex-col gap-2 text-sm font-thin">
                      <p>
                        <strong className="font-semibold">
                          {t("position_detail.department")}:{" "}
                        </strong>
                        {position?.department}
                      </p>
                      <p>
                        <strong className="font-semibold">
                          {t("position_detail.job_title")}:{" "}
                        </strong>
                        {position?.jobtitle}
                      </p>
                      <p>
                        <strong className="font-semibold">
                          {t("position_detail.experience_period")}:{" "}
                        </strong>
                        {position?.experienceperiod}
                      </p>
                      <p>
                        <strong className="font-semibold">
                          {t("position_detail.work_mode")}:{" "}
                        </strong>
                        {position?.modeofoperation}
                      </p>
                      <p>
                        <strong className="font-semibold">
                          {t("position_detail.contract_type")}:{" "}
                        </strong>
                        {position?.worktype}
                      </p>
                      <p>
                        <strong className="font-semibold">
                          {t("position_detail.preferred_industries")}:{" "}
                        </strong>
                        {position?.industry && position?.industry?.join(", ")}
                      </p>
                      <p>
                        <strong className="font-semibold">
                          {t("position_detail.banned_companies")}:{" "}
                        </strong>
                        {position?.bannedCompanies &&
                          position?.bannedCompanies?.join(", ")}
                      </p>
                      <p>
                        <strong className="font-semibold">
                          {t("position_detail.preferred_companies")}:{" "}
                        </strong>
                        {position?.preferredCompanies &&
                          position?.preferredCompanies?.join(", ")}
                      </p>
                      <div className="w-[207px] h-[1px] bg-[#E8E8E8]"></div>
                      <p>
                        <strong className="font-semibold">
                          {t("position_detail.skills")}:{" "}
                        </strong>
                        <ul className="list-disc ml-4 mt-1 grid grid-cols-2 font-thin">
                          {position?.skills.map((skill, index) => (
                            <li key={index}>{skill}</li>
                          ))}
                        </ul>
                      </p>
                    </div>
                  </div>
                  <div className="w-full rounded-xl bg-white p-4 ml-5">
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
                <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-1 xl:grid-cols-4 gap-8 items-center justify-center">
                  {!nominees.length && (
                    <div className="flex w-screen  justify-center items-center">
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                  )}
                  {nominees.map((nominee, index) => (
                    <div className="flex flex-col bg-white  rounded-2xl border shadow relative  w-auto m-3 2xl:w-[339px] ">
                      <div className=" p-4">
                        <CircularBar nominee={nominee}></CircularBar>
                        <strong className="text-sm font-semibold font-sans">
                          {t("position_detail.matched_skills")}
                        </strong>
                        <div class="mb-2 flex flex-row justify-around gap-2">
                          <ul className="w-full h-[88px]">
                            {nominee.commonSkills.map((skill, index) => {
                              if (index > 3) {
                              } else if (index === 3) {
                                return (
                                  <li className="text-[#6D6D6D]" key={index}>
                                    ....
                                  </li>
                                );
                              } else {
                                return (
                                  <li className="text-[#6D6D6D]" key={index}>
                                    {skill}
                                  </li>
                                );
                              }
                            })}
                          </ul>

                          <div className="flex items-end justify-end"></div>
                        </div>
                      </div>

                      <button
                        className="w-full py-3 bg-[#99C2FF]  hover:bg-[#63a1ff] rounded-b-2xl items-center justify-center text-sm text-[#0057D9] font-semibold"
                        onClick={() => handleNomineeDetail(nominee.cv, true)}
                      >
                        {t("position_detail.details")}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
            {selectedTab === 2 && (
              <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-1 xl:grid-cols-4 gap-8 items-center justify-center">
                {!suggestedNominees.length && (
                  <div className="flex w-screen  justify-center items-center">
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  </div>
                )}
                {suggestedNominees.map((nominee, index) => (
                  <div className="flex flex-col bg-white  rounded-2xl border shadow relative  w-auto m-3 2xl:w-[339px] ">
                    <div className=" p-4">
                      <CircularBar
                        nominee={nominee}
                        isKnown={false}
                      ></CircularBar>

                      <strong className="text-sm font-semibold font-sans">
                        {t("position_detail.matched_skills")}
                      </strong>
                      <div class="mb-2 flex flex-row justify-around gap-2">
                        <ul className="w-full h-[88px]">
                          {nominee.commonSkills.map((skill, index) => {
                            if (index > 3) {
                            } else if (index === 3) {
                              return (
                                <li className="text-[#6D6D6D]" key={index}>
                                  ....
                                </li>
                              );
                            } else {
                              return (
                                <li className="text-[#6D6D6D]" key={index}>
                                  {skill}
                                </li>
                              );
                            }
                          })}
                        </ul>

                        <div className="flex items-end justify-end">
                          <div className="w-[90px] flex items-center justify-center">
                            <button
                              disabled={buttonLoadingList[index]}
                              className="w-20 px-2 text-base text-white py-1 rounded-lg  bg-[#0057D9] hover:bg-[#0019d9]  text-center justify-center items-center"
                              onClick={() => {
                                handleRequestedNominee(nominee.cv?._id, index);
                              }}
                            >
                              {buttonLoadingList[index] ? (
                                <Spin
                                  indicator={
                                    <LoadingOutlined
                                      style={{
                                        fontSize: 16,
                                        color: "white",
                                      }}
                                      spin
                                    />
                                  }
                                />
                              ) : (
                                t("position_detail.request")
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      className="w-full py-3 bg-[#99C2FF]  hover:bg-[#63a1ff] rounded-b-2xl items-center justify-center text-sm text-[#0057D9] font-semibold"
                      onClick={() => handleNomineeDetail(nominee.cv, false)}
                    >
                      {t("position_detail.details")}
                    </button>
                  </div>
                ))}
              </div>
            )}
            {selectedTab === 3 && (
              <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-1 xl:grid-cols-4 gap-8 items-center justify-center">
                {!requestedNominees.length && (
                  <div className="flex w-screen  justify-center items-center">
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  </div>
                )}
                {requestedNominees.map((nominee, index) => (
                  <div className="flex flex-col bg-white  rounded-2xl border shadow relative  w-auto m-3 2xl:w-[339px] ">
                    <div className=" p-4">
                      <CircularBar
                        nominee={nominee}
                        isKnown={false}
                      ></CircularBar>

                      <strong className="text-sm font-semibold font-sans">
                        {t("position_detail.matched_skills")}
                      </strong>
                      <div class="mb-2 flex flex-row justify-around gap-2">
                        <ul className="w-full h-[88px]">
                          {nominee.commonSkills.map((skill, index) => {
                            if (index > 3) {
                            } else if (index === 3) {
                              return (
                                <li className="text-[#6D6D6D]" key={index}>
                                  ....
                                </li>
                              );
                            } else {
                              return (
                                <li className="text-[#6D6D6D]" key={index}>
                                  {skill}
                                </li>
                              );
                            }
                          })}
                        </ul>

                        <div className="flex items-end justify-end">
                          <div className="w-[90px] flex items-center justify-center">
                            <button
                              disabled={buttonLoadingList[index]}
                              className="w-20 px-2 text-base text-white py-1 rounded-lg   bg-[#ED4245] hover:bg-[#ff1e25]  text-center "
                              onClick={() => {
                                handleCancelRequest(nominee.cv?._id, index);
                              }}
                            >
                              {buttonLoadingList[index] ? (
                                <Spin
                                  indicator={
                                    <LoadingOutlined
                                      style={{
                                        fontSize: 16,
                                        color: "white",
                                      }}
                                      spin
                                    />
                                  }
                                />
                              ) : (
                                t("position_detail.cancel_request")
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      className="w-full py-3 bg-[#99C2FF]  hover:bg-[#63a1ff] rounded-b-2xl text-sm text-[#0057D9] font-semibold"
                      onClick={() => handleNomineeDetail(nominee.cv, false)}
                    >
                      {t("position_detail.details")}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {isNomineeDetailOpen && (
        <NomineeDetail
          nominee={nomineeDetail}
          isKnown={isKnown}
          onClose={closeNomineeDetail}
        />
      )}
    </div>
  );
};

export default PositionDetail;
