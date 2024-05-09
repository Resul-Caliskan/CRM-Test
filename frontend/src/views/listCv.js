import React, { useState, useEffect } from "react";
import axios from "axios";
import { getIdFromToken } from "../utils/getIdFromToken";
import { FaInfoCircle, FaStar } from "react-icons/fa";
import NomineeDetail from "../components/nomineeDetail";
import SearchInput from "../components/searchInput";
import Highlighter from "react-highlight-words";
import Loading from "../components/loadingComponent";
import Notification from "../utils/notification";

import { useNavigate } from "react-router-dom";
import "../components/style.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Button } from "antd";
import FilterComponent from "../components/filterComponent";
import filterFunction from "../utils/globalSearchFunction";
import DemandNomineeModel from "../components/demandNomineeModel";
import socket from "../config/config";
import NomineeCard from "../components/CVNomineeCard";
import { useTranslation } from "react-i18next";

const CVList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sharedItems, setSharedItems] = useState([]);
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const companyId = getIdFromToken(localStorage.getItem("token"));
  const apiUrl = process.env.REACT_APP_API_URL;
  const [isNomineeDetailOpen, setIsNomineeDetailOpen] = useState(false);
  const [nomineeDetail, setNomineeDetail] = useState();
  const [isKnown, setIsKnown] = useState(true);
  const [parameterOptions, setParameterOptions] = useState([]);
  const [favoriteSharedNominees, setFavoriteSharedNominees] = useState();
  const [favoriteCvs, setFavoriteCvs] = useState();
  const [selectedTab, setSelectedTab] = useState(0);
  const [filters, setFilters] = useState({
    skills: [],
    jobtitle: [],
  });
  const [open, setOpen] = useState(false);
  const [selectedNominee, setSelectedNominee] = useState();
  const [favorites, setFavorites] = useState(false);
  const handleTabChange = (index) => {
    setSelectedTab(index);
  };
  const [positions, setPositions] = useState([]);
  const openNomineeDetail = () => {
    setIsNomineeDetailOpen(true);
  };

  const closeNomineeDetail = () => {
    setIsNomineeDetailOpen(false);
  };

  const getAllFavorites = async (sharedItems, cvs) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/nominee/get-favorites/${companyId}`
      );
      const favorites = response.data.favorites;

      // Favori adayları bulmak için sharedItems ve cvs dizilerini dolaşma
      const favoriteSharedItems = [];
      const favoriteCvs = [];

      favorites.forEach((favorite) => {
        // sharedItems içinde favori adayı bulma
        const sharedItem = sharedItems.find(
          (item) => item.nomineeInfo._id === favorite
        );

        if (sharedItem) {
          console.log(sharedItems.title);
          favoriteSharedItems.push(sharedItem.nomineeInfo);
        }

        // cvs içinde favori adayı bulma
        const cv = cvs.find((cv) => cv._id === favorite);
        if (cv) {
          favoriteCvs.push(cv);
        }
      });
      // Favori adayları listelerini state'e ata
      if (favoriteSharedItems) {
        setFavoriteSharedNominees(favoriteSharedItems);
      }
      if (favoriteCvs) {
        setFavoriteCvs(favoriteCvs);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  const filterCvs = (cvs, isNormal, searchTerm) => {
    return cvs.filter((candidate) => {
      const searchFields = ["title", "skills", "exprience"];
      const searchTermFields = ["title", "skills", "name", "exprience"];
      const { jobtitle, skills } = filters;
      if (isNormal) {
        return (
          (jobtitle.length === 0 ||
            jobtitle.includes(candidate.nomineeInfo.title) ||
            jobtitle.includes(candidate.jobtitle)) &&
          (skills.length === 0 ||
            skills.some((skill) =>
              candidate.nomineeInfo.skills
                .map((s) => s.toLowerCase())
                .includes(skill.toLowerCase())
            )) &&
          (searchTerm === "" ||
            filterFunction(
              searchTermFields,
              candidate.nomineeInfo,
              searchTerm.toLowerCase()
            ))
        );
      }
      return (
        (jobtitle.length === 0 || jobtitle.includes(candidate.title)) &&
        (skills.length === 0 ||
          skills.some((skill) =>
            candidate.skills
              .map((s) => s.toLowerCase())
              .includes(skill.toLowerCase())
          )) &&
        (searchTerm === "" ||
          filterFunction(searchTermFields, candidate, searchTerm.toLowerCase()))
      );
    });
  };

  useEffect(() => {
    fetchCVs();
    fetchParameterOptions();
    fetchPositions();
  }, []);
  const fetchParameterOptions = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/parameters`
      );
      const filteredOptions = response.data.filter((option) => {
        return option.title === "Yetenekler" || option.title === "İş Unvanı";
      });

      setParameterOptions(handleLocalization(filteredOptions));
    } catch (error) {
      console.error("Parameter options fetching failed:", error);
    }
  };

  const fetchPositions = async () => {
    try {
      setLoading(true); // Set loading to true before making the request
      const response = await axios.get(
        `${apiUrl}/api/positions/get/${companyId}`
      );
      setPositions(response.data);
    } catch (error) {
      console.error("Positions fetching failed:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchCVs = async () => {
    setLoading(true);
    try {
      const postResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/nominee/get-nominees`,
        { companyId: companyId, isAdmin: false }
      );

      const shared = postResponse.data.sharedNominees;
      const cvPool = postResponse.data.allCvs;
      setSharedItems(shared);
      setCvs(cvPool);

      getAllFavorites(shared, cvPool);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };
  const handlePositionDetails = (positionId) => {
    if (positionId) {
      navigate(`/position-detail/${positionId}`);
    } else {
      console.error(
        "Pozisyon detayları alınamadı: Pozisyon bilgileri eksik veya geçersiz."
      );
    }
  };
  const handleLocalization = (parameters) => {
    return parameters.map((parameter) => {
      if (parameter.title === "Yetenekler") {
        parameter.title = t("listCandidates.skills");
        return parameter;
      }
      if (parameter.title === "İş Unvanı") {
        parameter.title = t("listCandidates.jobtitle");
        return parameter;
      }
    });
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
      Notification("success", "Talep Başarıyla Silindi.");
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
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-row justify-evenly  bg-[#FAFAFA]">
          <div className="hidden sideFilter  sm:flex  sm:flex-col sm:w-[280px] md:w-auto  lg:w-[30%] p-2">
            <FilterComponent
              setFilters={setFilters}
              parameterOptions={parameterOptions}
              isHorizontal={false}
            />
          </div>

          <div className="flex flex-col w-full contentCV overflow-hidden ">
            <div className="justify-center items-center px-10">
              <div className="flex flex-col h-max border   lg:flex-row bg-white lg:justify-between items-center rounded-2xl m-2">
                <div className="flex flex-row justify-start items-center ml-2 p-2">
                  <button
                    className={`flex items-center justify-center m-2 ${
                      selectedTab === 0 ? "border-b-2 pb-1 border-blue-400" : ""
                    } `}
                    onClick={() => handleTabChange(0)}
                  >
                    {t("listCandidates.all_nominees")}
                  </button>
                  <button
                    className={`flex items-center justify-center m-2 ${
                      selectedTab === 1 ? "border-b-2 pb-1 border-blue-400" : ""
                    } `}
                    onClick={() => handleTabChange(1)}
                  >
                    {t("listCandidates.shared_with_me")}
                  </button>
                  <button
                    className={`flex items-center justify-center m-2 ${
                      selectedTab === 2 ? "border-b-2 pb-1 border-blue-400" : ""
                    } `}
                    onClick={() => handleTabChange(2)}
                  >
                    {t("listCandidates.cv_pool")}
                  </button>
                </div>
                <div className="hidden md:flex md:flex-row justify-end mr-2">
                  <SearchInput
                    searchTerm={searchTerm.toLowerCase()}
                    onSearch={handleSearch}
                  />
                </div>
              </div>
              <div className="contentPool">
                {selectedTab === 0 && (
                  <>
                    <div className="cols-span-1 p-4 md:border-r-2">
                      <ul>
                        {filterCvs(sharedItems, true, searchTerm).map(
                          (nominee, index) => (
                            <NomineeCard
                              nominee={nominee.nomineeInfo}
                              companyId={companyId}
                              searchTerm={searchTerm}
                              positionRoute={nominee.position.id}
                              known={true}
                            
                            />
                          )
                        )}
                      </ul>
                    </div>

                    <div className="cols-span-1 p-4">
                      <div className="grid grid-cols-1">
                        {filterCvs(cvs, false, searchTerm).map(
                          (nominee, index) => (
                            <NomineeCard
                              nominee={nominee}
                              companyId={companyId}
                              searchTerm={searchTerm}
                              known={false}
                              position={positions}
                            />
                          )
                        )}
                      </div>
                    </div>
                  </>
                )}
                {selectedTab === 1 && (
                  <>
                    {" "}
                    <div className="cols-span-1 p-4 md:border-r-2">
                      <ul>
                        {filterCvs(sharedItems, true, searchTerm).map(
                          (nominee, index) => (
                            <NomineeCard
                              nominee={nominee.nomineeInfo}
                              companyId={companyId}
                              searchTerm={searchTerm}
                              positionRoute={nominee.position.id}
                              known={true}
                              
                            />
                          )
                        )}
                      </ul>
                    </div>
                  </>
                )}

                {selectedTab === 2 && (
                  <>
                    <div className="cols-span-1 p-4">
                      <div className="grid grid-cols-1 gap-4">
                        {filterCvs(cvs, false, searchTerm).map(
                          (nominee, index) => (
                            <NomineeCard
                              nominee={nominee}
                              companyId={companyId}
                              searchTerm={searchTerm}
                              known={false}
                              position={positions}
                            />
                          )
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CVList;
