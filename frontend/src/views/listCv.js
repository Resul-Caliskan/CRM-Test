import React, { useState, useEffect } from "react";
import axios from "axios";
import { getIdFromToken } from "../utils/getIdFromToken";
import { FaInfoCircle, FaStar } from "react-icons/fa";
import NomineeDetail from "../components/nomineeDetail";
import SearchInput from "../components/searchInput";
import Highlighter from "react-highlight-words";
import Loading from "../components/loadingComponent";
import { FaRegStar } from "react-icons/fa";
import Notification from "../utils/notification";

import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../components/style.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Button, Input, Rate, notification } from "antd";
import FilterComponent from "../components/filterComponent";
import filterFunction from "../utils/globalSearchFunction";

const CVList = () => {
  const navigate = useNavigate();
  const [sharedItems, setSharedItems] = useState([]);
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const companyId = getIdFromToken(localStorage.getItem("token"));
  const [isNomineeDetailOpen, setIsNomineeDetailOpen] = useState(false);
  const [nomineeDetail, setNomineeDetail] = useState();
  const [isKnown, setIsKnown] = useState(true);
  const [parameterOptions, setParameterOptions] = useState([]);
  const [favoriteSharedNominees, setFavoriteSharedNominees] = useState();
  const [favoriteCvs, setFavoriteCvs] = useState();
  const [filters, setFilters] = useState({
    skills: [],
    jobtitle: [],
  });

  const [favorites, setFavorites] = useState(false);

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

      console.log("FAVORİ SHARED " + favoriteSharedItems);
      console.log("SİKTİMİN CVSİ " + favoriteCvs);

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

  const filterCandidates = (candidates, shared, searchTerm) => {
    return cvs.filter((candidate) => {
      const searchFields = ["title", "skills"];
      const { jobtitle, skills } = filters;
      return (
        (jobtitle.length === 0 || jobtitle.includes(candidate.title)) &&
        (skills.length === 0 || skills.includes(candidate.skills)) &&
        (searchTerm === "" ||
          filterFunction(searchFields, candidate, searchTerm.toLowerCase()))
      );
    });
  };

  const filterCvs = (cvs, isNormal, searchTerm) => {
    return cvs.filter((candidate) => {
      const searchFields = ["title", "skills"];
      const searchTermFields = ["title", "skills", "name"];
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
  }, []);
  const fetchParameterOptions = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/parameters`
      );
      const filteredOptions = response.data.filter((option) => {
        return option.title === "Yetenekler" || option.title === "İş Unvanı";
      });
      setParameterOptions(filteredOptions);
    } catch (error) {
      console.error("Parameter options fetching failed:", error);
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
  const handlePositionDetails = (positionId) => {
    if (positionId) {
      navigate(`/position-detail/${positionId}`);
    } else {
      console.error(
        "Pozisyon detayları alınamadı: Pozisyon bilgileri eksik veya geçersiz."
      );
    }
  };

  const handleAddToFavorites = async (nominee, isShared) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/nominee/add-favorites/${companyId}`,

        { nomineeId: nominee._id }
      );
      if (isShared) {
        console.log("GİRDİ" + nominee.title);
        setFavoriteSharedNominees([...favoriteSharedNominees, nominee]);
      } else {
        setFavoriteCvs([...favoriteCvs, nominee]);
      }

      Notification("success", "Aday Favorilere Eklendi.");
    } catch (error) {
      Notification("error", "Bu Aday Zaten Favorilere Eklendi.");
      console.error("Favori aday eklenirken bir hata oluştu:", error.message);
    }
  };

  const handleDeleteFavorites = async (nominee, isShared) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/nominee/delete-favorites/${companyId}`,
        { nomineeId: nominee._id }
      );
      if (isShared) {
        const updatedFavorites = favoriteSharedNominees.filter(
          (favNominee) => favNominee._id !== nominee._id
        );

        setFavoriteSharedNominees(updatedFavorites);
      } else {
        const updatedFavorites = favoriteCvs.filter(
          (favNominee) => favNominee._id !== nominee._id
        );

        setFavoriteCvs(updatedFavorites);
      }
      Notification("success", "Aday Favorilerden Silindi.");
      console.log("Favori aday eklendi:", response.data);
    } catch (error) {
      console.error("Favori aday eklenirken bir hata oluştu:", error.message);
    }
  };
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="body">
          <div className="leftMenu">
            <FilterComponent
              setFilters={setFilters}
              parameterOptions={parameterOptions}
              isHorizontal={false}
            />
          </div>
          <div className="rightTab">
            <div className="searchBar">
              <SearchInput
                searchTerm={searchTerm.toLowerCase()}
                onSearch={handleSearch}
              />
            </div>
            <div className="tabBar">
              <Tabs className="">
                <TabList className="pl-4">
                  <Tab>Tümü</Tab>
                  <Tab>Benimle Paylaşılanlar</Tab>
                  <Tab>Cv Havuzu</Tab>
                  <Tab>Favoriler</Tab>
                </TabList>
                <div className="contentPool">
                  <TabPanel>
                    <div className="cols-span-1 p-4 md:border-r-2">
                      <ul>
                        {filterCvs(sharedItems, true, searchTerm).map(
                          (nominee, index) => (
                            <div
                              key={index}
                              className="cvBox duration-150 p-4 rounded border shadow mb-4 relative"
                            >
                              <div className="flex justify-between">
                                {" "}
                                <h4 className="font-semibold text-lg mb-2 ">
                                  <Highlighter
                                    highlightClassName="highlighted"
                                    searchWords={[searchTerm]}
                                    autoEscape={true}
                                    textToHighlight={
                                      nominee.nomineeInfo?.name || ""
                                    }
                                  />{" "}
                                  <FaStar
                                    value={favorites}
                                    style={{
                                      fontSize: "24px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      handleAddToFavorites(
                                        nominee.nomineeInfo,
                                        true
                                      );
                                    }}
                                  />
                                </h4>
                                <h4>
                                  <div className="flex flex-col items-center ">
                                    {" "}
                                    <h4 className="font-semibold text-lg">
                                      Adayın Önerildiği Pozisyon:{" "}
                                    </h4>
                                    <h4
                                      className="font-semibold text-md mb-2 underline cursor-pointer"
                                      onClick={() =>
                                        handlePositionDetails(
                                          nominee?.position?.id
                                        )
                                      }
                                    >
                                      <Highlighter
                                        highlightClassName="highlighted"
                                        searchWords={[searchTerm]}
                                        autoEscape={true}
                                        textToHighlight={
                                          nominee?.position?.title || ""
                                        }
                                      />
                                    </h4>
                                  </div>
                                </h4>
                              </div>

                              <p>
                                <strong>Unvan:</strong>
                                <Highlighter
                                  highlightClassName="highlighted"
                                  searchWords={[searchTerm]}
                                  autoEscape={true}
                                  textToHighlight={
                                    nominee.nomineeInfo?.title || ""
                                  }
                                />
                              </p>
                              {nominee.nomineeInfo?.education.map(
                                (edu, index) => (
                                  <ul>
                                    <li key={index}>
                                      <div>
                                        <strong>Degree:</strong>
                                        <Highlighter
                                          highlightClassName="highlighted"
                                          searchWords={[searchTerm]}
                                          autoEscape={true}
                                          textToHighlight={edu.degree || ""}
                                        />
                                      </div>
                                    </li>
                                  </ul>
                                )
                              )}

                              <strong>Skills:</strong>
                              <ul className="list-disc ml-4">
                                {nominee.nomineeInfo?.skills.map(
                                  (skill, index) => (
                                    <li key={index}>
                                      <Highlighter
                                        highlightClassName="highlighted"
                                        searchWords={[searchTerm]}
                                        autoEscape={true}
                                        textToHighlight={skill || ""}
                                      />
                                    </li>
                                  )
                                )}
                              </ul>
                              <button
                                className="absolute right-4 bottom-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center"
                                onClick={() =>
                                  handleNomineeDetail(nominee.nomineeInfo, true)
                                }
                              >
                                Detaylar{" "}
                                <FaInfoCircle className="ml-2 size-4" />
                              </button>
                            </div>
                          )
                        )}
                      </ul>
                      {isNomineeDetailOpen && (
                        <NomineeDetail
                          className="duration-1000"
                          nominee={nomineeDetail}
                          isKnown={isKnown}
                          onClose={closeNomineeDetail}
                        />
                      )}
                    </div>

                    <div className="cols-span-1 p-4">
                      <div className="grid grid-cols-1">
                        {filterCvs(cvs, false, searchTerm).map(
                          (nominee, index) => (
                            <div
                              key={index}
                              className="cvBox p-4 rounded border shadow mb-4 relative"
                            >
                              <h4 className="font-semibold text-lg mb-2">
                                Unknown{" "}
                                <FaStar
                                  value={favorites}
                                  style={{
                                    fontSize: "24px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    handleAddToFavorites(nominee, false);
                                  }}
                                />
                              </h4>
                              <p>
                                <strong>Unvan:</strong>
                                <Highlighter
                                  highlightClassName="highlighted"
                                  searchWords={[searchTerm]}
                                  autoEscape={true}
                                  textToHighlight={nominee.title || ""}
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
                                        textToHighlight={edu.degree || ""}
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
                                      textToHighlight={skill || ""}
                                    />
                                  </li>
                                ))}
                              </ul>
                              <button
                                className="absolute right-4 bottom-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center"
                                onClick={() =>
                                  handleNomineeDetail(nominee, false)
                                }
                              >
                                Detaylar{" "}
                                <FaInfoCircle className="ml-2 size-4" />
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div className="cols-span-1 p-4 md:border-r-2">
                      <ul>
                        {filterCvs(sharedItems, true, searchTerm).map(
                          (nominee, index) => (
                            <div
                              key={index}
                              className="cvBox duration-150 p-4 rounded border shadow mb-4 relative"
                            >
                              <div className="flex justify-between">
                                {" "}
                                <h4 className="font-semibold text-lg mb-2 ">
                                  <Highlighter
                                    highlightClassName="highlighted"
                                    searchWords={[searchTerm]}
                                    autoEscape={true}
                                    textToHighlight={
                                      nominee.nomineeInfo.name || ""
                                    }
                                  />{" "}
                                  <FaStar
                                    value={favorites}
                                    style={{
                                      fontSize: "24px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      handleAddToFavorites(
                                        nominee.nomineeInfo,
                                        true
                                      );
                                    }}
                                  />
                                </h4>
                                <h4>
                                  <div className="flex flex-col items-center ">
                                    {" "}
                                    <h4 className="font-semibold text-lg">
                                      Adayın Önerildiği Pozisyon:{" "}
                                    </h4>
                                    <h4
                                      className="font-semibold text-md mb-2 underline cursor-pointer"
                                      onClick={() =>
                                        handlePositionDetails(
                                          nominee?.position?.id
                                        )
                                      }
                                    >
                                      <Highlighter
                                        highlightClassName="highlighted"
                                        searchWords={[searchTerm]}
                                        autoEscape={true}
                                        textToHighlight={
                                          nominee?.position?.title || ""
                                        }
                                      />
                                    </h4>
                                  </div>
                                </h4>
                              </div>

                              <p>
                                <strong>Unvan:</strong>
                                <Highlighter
                                  highlightClassName="highlighted"
                                  searchWords={[searchTerm]}
                                  autoEscape={true}
                                  textToHighlight={
                                    nominee.nomineeInfo.title || ""
                                  }
                                />
                              </p>
                              {nominee.nomineeInfo.education.map(
                                (edu, index) => (
                                  <ul>
                                    <li key={index}>
                                      <div>
                                        <strong>Degree:</strong>
                                        <Highlighter
                                          highlightClassName="highlighted"
                                          searchWords={[searchTerm]}
                                          autoEscape={true}
                                          textToHighlight={edu.degree || ""}
                                        />
                                      </div>
                                    </li>
                                  </ul>
                                )
                              )}
                              <strong>Skills:</strong>
                              <ul className="list-disc ml-4">
                                {nominee.nomineeInfo.skills.map(
                                  (skill, index) => (
                                    <li key={index}>
                                      <Highlighter
                                        highlightClassName="highlighted"
                                        searchWords={[searchTerm]}
                                        autoEscape={true}
                                        textToHighlight={skill || ""}
                                      />
                                    </li>
                                  )
                                )}
                              </ul>
                              <button
                                className="absolute right-4 bottom-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center"
                                onClick={() =>
                                  handleNomineeDetail(nominee.nomineeInfo, true)
                                }
                              >
                                Detaylar{" "}
                                <FaInfoCircle className="ml-2 size-4" />
                              </button>
                            </div>
                          )
                        )}
                      </ul>
                    </div>
                    {isNomineeDetailOpen && (
                      <NomineeDetail
                        className="duration-1000"
                        nominee={nomineeDetail}
                        isKnown={isKnown}
                        onClose={closeNomineeDetail}
                      />
                    )}
                  </TabPanel>
                  <TabPanel>
                    <div className="cols-span-1 p-4">
                      <div className="grid grid-cols-1 gap-4">
                        {filterCvs(cvs, false, searchTerm).map(
                          (nominee, index) => (
                            <div
                              key={index}
                              className="cvBox p-4 rounded border shadow mb-4 relative"
                            >
                              <h4 className="font-semibold text-lg mb-2">
                                Unknown{" "}
                                <FaStar
                                  value={favorites}
                                  style={{
                                    fontSize: "24px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    handleAddToFavorites(nominee, false);
                                  }}
                                />
                              </h4>
                              <p>
                                <strong>Unvan:</strong>
                                <Highlighter
                                  highlightClassName="highlighted"
                                  searchWords={[searchTerm]}
                                  autoEscape={true}
                                  textToHighlight={nominee.title || ""}
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
                                        textToHighlight={edu.degree || ""}
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
                                      textToHighlight={skill || ""}
                                    />
                                  </li>
                                ))}
                              </ul>
                              <button
                                className="absolute right-4 bottom-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center"
                                onClick={() =>
                                  handleNomineeDetail(nominee, false)
                                }
                              >
                                Detaylar{" "}
                                <FaInfoCircle className="ml-2 size-4" />
                              </button>
                            </div>
                          )
                        )}
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
                  </TabPanel>
                  <TabPanel>
                    <div className="cols-span-1 p-4 md:border-r-2">
                      <ul>
                        {console.log("FAVORİ CVLER" + favoriteCvs)}
                        {favoriteCvs &&
                          favoriteCvs.map((nominee, index) => (
                            <div
                              key={index}
                              className="cvBox duration-150 p-4 rounded border shadow mb-4 relative"
                            >
                              <div className="flex justify-between">
                                <h4 className="font-semibold text-lg mb-2 ">
                                  Unknown
                                  <FaStar
                                    value={favorites}
                                    style={{
                                      fontSize: "24px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handleDeleteFavorites(nominee,false)
                                    }
                                  />
                                </h4>
                                <h4>
                                  <div className="flex flex-col items-center ">
                                    <h4 className="font-semibold text-lg">
                                      Adayın Önerildiği Pozisyon:{" "}
                                    </h4>
                                    <h4
                                      className="font-semibold text-md mb-2 underline cursor-pointer"
                                      onClick={() =>
                                        handlePositionDetails(
                                          nominee?.position?.id
                                        )
                                      }
                                    >
                                      <Highlighter
                                        highlightClassName="highlighted"
                                        searchWords={[searchTerm]}
                                        autoEscape={true}
                                        textToHighlight={
                                          nominee?.position?.title || ""
                                        }
                                      />
                                    </h4>
                                  </div>
                                </h4>
                              </div>

                              <p>
                                <strong>Unvan:</strong>
                                <Highlighter
                                  highlightClassName="highlighted"
                                  searchWords={[searchTerm]}
                                  autoEscape={true}
                                  textToHighlight={nominee.title || ""}
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
                                        textToHighlight={edu.degree || ""}
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
                                      textToHighlight={skill || ""}
                                    />
                                  </li>
                                ))}
                              </ul>
                              <button
                                className="absolute right-4 bottom-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center"
                                onClick={() =>
                                  handleNomineeDetail(nominee, true)
                                }
                              >
                                Detaylar{" "}
                                <FaInfoCircle className="ml-2 size-4" />
                              </button>
                            </div>
                          ))}
                        {console.log(
                          "FAVORİ SİKTİM paylaşılan" + favoriteSharedNominees
                        )}

                        {favoriteSharedNominees &&
                          favoriteSharedNominees.map((nominee, index) => (
                            <div
                              key={index}
                              className="cvBox duration-150 p-4 rounded border shadow mb-4 relative"
                            >
                              <div className="flex justify-between">
                                <h4 className="font-semibold text-lg mb-2 ">
                                  <Highlighter
                                    highlightClassName="highlighted"
                                    searchWords={[searchTerm]}
                                    autoEscape={true}
                                    textToHighlight={nominee.name || ""}
                                  />{" "}
                                  <FaStar
                                    value={favorites}
                                    style={{
                                      fontSize: "24px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handleDeleteFavorites(nominee,true)
                                    }
                                  />
                                </h4>
                                <h4>
                                  <div className="flex flex-col items-center ">
                                    <h4 className="font-semibold text-lg">
                                      Adayın Önerildiği Pozisyon:{" "}
                                    </h4>
                                    <h4
                                      className="font-semibold text-md mb-2 underline cursor-pointer"
                                      onClick={() =>
                                        handlePositionDetails(
                                          nominee.position.id
                                        )
                                      }
                                    >
                                      <Highlighter
                                        highlightClassName="highlighted"
                                        searchWords={[searchTerm]}
                                        autoEscape={true}
                                        textToHighlight={
                                          nominee.position?.title || ""
                                        }
                                      />
                                    </h4>
                                  </div>
                                </h4>
                              </div>

                              <p>
                                <strong>Unvan:</strong>
                                <Highlighter
                                  highlightClassName="highlighted"
                                  searchWords={[searchTerm]}
                                  autoEscape={true}
                                  textToHighlight={nominee?.title || ""}
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
                                        textToHighlight={edu.degree || ""}
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
                                      textToHighlight={skill || ""}
                                    />
                                  </li>
                                ))}
                              </ul>
                              <button
                                className="absolute right-4 bottom-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center"
                                onClick={() =>
                                  handleNomineeDetail(nominee, true)
                                }
                              >
                                Detaylar{" "}
                                <FaInfoCircle className="ml-2 size-4" />
                              </button>
                            </div>
                          ))}
                      </ul>
                    </div>
                  </TabPanel>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CVList;
