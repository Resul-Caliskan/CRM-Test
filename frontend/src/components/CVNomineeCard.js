import React, { useState } from "react";
import { FaStar, FaInfoCircle } from "react-icons/fa";
import Highlighter from "react-highlight-words";
import axios from "axios"; // Import axios for API requests
import NomineeDetail from "../components/nomineeDetail"; // Import your NomineeDetail component here
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Notification from "../utils/notification";
import "../components/style.css";
import { Button, Tooltip } from "antd";
import socket from "../config/config";
import DemandNomineeModel from "./demandNomineeModel";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

const NomineeCard = ({
  nominee,
  searchTerm,
  companyId,
  known,
  position = null,
  positionRoute = "Zort",
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [isNomineeDetailOpen, setIsNomineeDetailOpen] = useState(false);
  const [nomineeDetail, setNomineeDetail] = useState(null);
  const [isKnown, setIsKnown] = useState(known);
  const [open, setOpen] = useState(false);
  const [selectedNominee, setSelectedNominee] = useState();
  const [favoriteSharedNominees, setFavoriteSharedNominees] = useState([]);
  const [positions, setPositions] = useState(position);

  const handlePositionDetails = (positionId) => {
    if (positionId) {
      navigate(`/position-detail/${positionId}`);
    } else {
      console.error(t("position_details_error"));
    }
  };

  const handleNomineeDetail = (nominee, isKnown) => {
    if (nominee && nominee._id) {
      setIsKnown(isKnown);
      setNomineeDetail(nominee);
      openNomineeDetail();
    } else {
      console.error(t("position_details_error"));
    }
  };

  const openNomineeDetail = () => {
    setIsNomineeDetailOpen(true);
  };

  const closeNomineeDetail = () => {
    setIsNomineeDetailOpen(false);
  };
  const handleRequestNominee = (nominee) => {
    setOpen(true);
    setSelectedNominee(nominee._id);
  };
  const handleCancelRequest = async (nomineeId, positionId) => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/positions/delete-request/${positionId}`,
        { nomineeId: nomineeId }
      );

      try {
        const response2 = await axios.delete(
          `${apiUrl}/api/notification/delete/${positionId}/${nomineeId}`
        );
        socket.emit("notificationDeleted", response2.data.notification);
      } catch (error) {
        console.error("Bildirim silinirken bir hata oluştu:", error);
      }
      setPositions((prevPositions) => {
        // Seçilen pozisyonun index'ini bul
        const positionIndex = prevPositions.findIndex(
          (position) => position._id === positionId
        );

        // Eğer pozisyon bulunamazsa, mevcut pozisyon listesini geri döndür
        if (positionIndex === -1) {
          return prevPositions;
        }

        // Seçilen pozisyonu kopyala
        const updatedPositions = [...prevPositions];

        // Seçilen pozisyonun aday listesinden belirli adayı çıkar
        updatedPositions[positionIndex] = {
          ...updatedPositions[positionIndex],
          requestedNominees: updatedPositions[
            positionIndex
          ].requestedNominees.filter((id) => id !== nomineeId),
        };

        // Güncellenmiş pozisyon listesini döndür
        return updatedPositions;
      });
      socket.emit("notificationDeleted", positionId);
      Notification("success", t("position_detail.requestCancel_success"));
    } catch (error) {
      console.error("Talep silinirken bir hata oluştu:", error);
    }
  };
  const checkNomineeInPositions = (nomineeId, positions) => {
    // positions içindeki her bir pozisyonu gez
    for (let i = 0; i < positions.length; i++) {
      console.log("sdklksjfsd" + positions[i].requestedNominees[0]);
      for (let j = 0; j < positions[i].requestedNominees.length; j++) {
        // Eğer nomineeId, mevcut talep edilen adayın ID'sine eşitse, true döndür
        console.log(positions[i].requestedNominees[j] + "  " + nomineeId);
        if (positions[i].requestedNominees[j] === nomineeId) {
          console.log("girdiiii");
          return positions[i];
        }
      }
    }
    return false;
  };

  return (
    <div className="m-2 my-3">
      {!isKnown && (
        <DemandNomineeModel
          open={open}
          setOpen={setOpen}
          nomineeId={selectedNominee}
          positions={positions}
          setPositions={setPositions}
        />
      )}
      <div
        className={`grid ${
          isKnown ? "grid-cols-4" : "grid-cols-3"
        } bg-white px-2 py-3 border rounded-lg`}
      >
        <div className="flex justify-between">
          <div className="p-2 border-r-2 mr-1 px-10 ">
            <h4 className="font-semibold text-lg ">
              {isKnown ? (
                <Highlighter
                  highlightClassName="highlighted"
                  searchWords={[searchTerm]}
                  autoEscape={true}
                  textToHighlight={nominee.name || ""}
                />
              ) : (
                <Highlighter
                  highlightClassName="highlighted"
                  searchWords={[searchTerm]}
                  autoEscape={true}
                  textToHighlight={t("listCandidates.unknown")}
                />
              )}
            </h4>
            <h2 className="font-normal text-[#4B4B4B] text-sm">
              <Highlighter
                highlightClassName="highlighted"
                searchWords={[searchTerm]}
                autoEscape={true}
                textToHighlight={nominee.title || ""}
              />
            </h2>
          </div>
          <h4></h4>
        </div>
        {isKnown ? (
          <div className="p-2 border-r-2 px-10">
            <h4 className="font-semibold text-[#4B4B4B] text-sm">
              {t("listCandidates.position_proposed")}
            </h4>
            <h4
              className="text-sm text-[#4B4B4B]  underline cursor-pointer"
              onClick={() => handlePositionDetails(positionRoute)}
            >
              <Highlighter
                highlightClassName="highlighted"
                searchWords={[searchTerm]}
                autoEscape={true}
                textToHighlight={nominee.title || ""}
              />
            </h4>
          </div>
        ) : (
          <></>
        )}
        <div className="p-2 border-r-2 px-10">
          <h4 className="font-semibold text-[#4B4B4B] text-sm">
            {t("listCandidates.experiences")}
          </h4>
          <ul className="">
            {nominee.experience.map((exp, index) => {
              if (index > 3) {
                return null;
              } else if (index === 3) {
                return (
                  <li className="text-[#6D6D6D]" key={index}>
                    ....
                  </li>
                );
              } else {
                return (
                  <li
                    className="list-disc text-[#6D6D6D] text-sm ml-4"
                    key={index}
                  >
                    <Highlighter
                      highlightClassName="highlighted"
                      searchWords={[searchTerm]}
                      autoEscape={true}
                      textToHighlight={exp.position || ""}
                    />
                  </li>
                );
              }
            })}
          </ul>
        </div>
        <div className="flex flex-row justify-around p-2">
          <div className="">
            <h4 className="font-semibold text-[#4B4B4B] text-sm">
              {t("listCandidates.skills")}
            </h4>
            <ul className="">
              {nominee.skills.map((skill, index) => {
                if (index > 3) {
                  return null;
                } else if (index === 3) {
                  return (
                    <li className="text-[#6D6D6D]" key={index}>
                      ....
                    </li>
                  );
                } else {
                  return (
                    <li
                      className="list-disc text-[#6D6D6D] text-sm ml-4"
                      key={index}
                    >
                      <Highlighter
                        highlightClassName="highlighted"
                        searchWords={[searchTerm]}
                        autoEscape={true}
                        textToHighlight={skill || ""}
                      />
                    </li>
                  );
                }
              })}
            </ul>
          </div>
          <div className="px-3"></div>
          <div className="flex flex-col justify-around items-center">
            <Tooltip placement={"top"} title={t("details")}>
              <button
                className="flex flex-row p-3 text-white  rounded-lg text-base bg-[#0057D9] hover:bg-[#0019d9]  text-center justify-center items-center"
                onClick={() => handleNomineeDetail(nominee, isKnown)}
              >
                <FaInfoCircle className="size-4" />
              </button>
            </Tooltip>
            {!isKnown && (
              <>
                {" "}
                {!checkNomineeInPositions(nominee._id, positions) ? (
                  <Tooltip placement={"top"} title={t("request_position")}>
                  <button
                    className="flex flex-row p-3 text-white  rounded-lg text-base bg-[#0057D9] hover:bg-[#0019d9]  text-center justify-center items-center"
                    onClick={() => handleRequestNominee(nominee)}
                  >
                    <PlusOutlined className="size-4" />
                  </button>
                  </Tooltip>
                ) : (
                  <Tooltip placement={"top"} title={t("cancel")}>
                    <button
                      className="flex flex-row p-3 text-white  rounded-lg text-base bg-[#ED4245] hover:bg-[#ff1e25]   text-center justify-center items-center"
                      onClick={() => {
                        handleCancelRequest(
                          nominee._id,
                          checkNomineeInPositions(nominee._id, positions)._id
                        );
                      }}
                    >
                      <MinusOutlined className="size-4" />
                    </button>
                  </Tooltip>
                )}
              </>
            )}
          </div>
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
  );
};

export default NomineeCard;