import React, { useState, useEffect } from "react";
import axios from "axios";
import { getIdFromToken } from "../utils/getIdFromToken";
import SearchInput from "../components/searchInput";
import Loading from "../components/loadingComponent";
import { useNavigate } from "react-router-dom";
import "../components/style.css";
import FilterComponent from "../components/filterComponent";
import filterFunction from "../utils/globalSearchFunction";
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
  const [isKnown, setIsKnown] = useState(true);
  const [parameterOptions, setParameterOptions] = useState([]);
  const [favoriteSharedNominees, setFavoriteSharedNominees] = useState();
  const [favoriteCvs, setFavoriteCvs] = useState();
  const [selectedTab, setSelectedTab] = useState(0);
  const [filters, setFilters] = useState({
    skills: [],
    jobtitle: [],
  });

  const handleTabChange = (index) => {
    setSelectedTab(index);
  };
  const [positions, setPositions] = useState([]);

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

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-row justify-evenly  bg-[#FAFAFA]">
          <div
            className="hidden sideFilter  sm:flex  sm:flex-col sm:w-[280px] md:w-[30%]
             p-2"
          >
            <FilterComponent
              setFilters={setFilters}
              parameterOptions={parameterOptions}
              isHorizontal={false}
            />
          </div>

          <div className="flex flex-col w-full contentCV overflow-hidden ">
            <div className="justify-center items-center pt-6">
              <div className="flex flex-col h-max border   lg:flex-row bg-white lg:justify-between items-center rounded-xl m-2">
                <div className="flex flex-row justify-start items-center ml-2 p-2">
                  <button
                    className={`flex items-center border-b-2  justify-center m-2 ${
                      selectedTab === 0 ? "border-b-2  border-blue-400" : "border-white"
                    } `}
                    onClick={() => handleTabChange(0)}
                  >
                    {t("listCandidates.all_nominees")}
                  </button>
                  <button
                    className={`flex items-center border-b-2 justify-center m-2 ${
                      selectedTab === 1 ? "border-b-2  border-blue-400" : "border-white"
                    } `}
                    onClick={() => handleTabChange(1)}
                  >
                    {t("listCandidates.shared_with_me")}
                  </button>
                  <button
                    className={`flex items-center border-b-2 justify-center m-2 ${
                      selectedTab === 2 ? "border-b-2  border-blue-400" : "border-white"
                    } `}
                    onClick={() => handleTabChange(2)}
                  >
                    {t("listCandidates.cv_pool")}
                  </button>
                </div>
                <div className="hidden md:flex md:flex-row justify-end mr-2 h-[50px]">
                  <SearchInput
                    searchTerm={searchTerm.toLowerCase()}
                    onSearch={handleSearch}
                  />
                </div>
              </div>
              <div className="contentPool">
                {selectedTab === 0 && (
                  <>
                    <div className="cols-span-1  s:mp-4 md:border-r-2">
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

                    <div className="cols-span-1  s:mp-4 md:border-r-2">
                      
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
                  </>
                )}
                {selectedTab === 1 && (
                  <>
                    {" "}
                    <div className="cols-span-1  mp-4 md:border-r-2">
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
                  {" "}
                  <div className="cols-span-1 mp-4 md:border-r-2">
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
