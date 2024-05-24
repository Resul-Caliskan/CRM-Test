import React, { useState, useEffect, useCallback } from "react";
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
import { Pagination } from "antd";
import { debounce } from "lodash";

const CVList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sharedItems, setSharedItems] = useState([]);
  const [cvs, setCvs] = useState([]);
  const [allNominees,setAllNominees]=useState([]);
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
  const [checkedItems, setCheckedItems] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalCvsCount, setTotalCvsCount] = useState(1);
  const [positions, setPositions] = useState([]);

  const handleTabChange = (index) => {
    setSelectedTab(index);
    setCurrent(1);
    setPageSize(5);
    if(index===0)
      fetchAllNominees(1,filters,5,searchTerm);
    else if(index === 1)
      fetchSharedNominees(1,filters,5,searchTerm);
    else 
      fetchCVs(1,filters,5,searchTerm);
  };

 

  const getAllFavorites = async (sharedItems, cvs) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/nominee/get-favorites/${companyId}`
      );
      const favorites = response.data.favorites;
      const favoriteSharedItems = [];
      const favoriteCvs = [];

      favorites.forEach((favorite) => {
        const sharedItem = sharedItems.find(
          (item) => item.nomineeInfo._id === favorite
        );

        if (sharedItem) {
          favoriteSharedItems.push(sharedItem.nomineeInfo);
        }
        const cv = cvs.find((cv) => cv._id === favorite);
        if (cv) {
          favoriteCvs.push(cv);
        }
      });
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
  
  useEffect(() => {
    fetchParameterOptions();
    fetchPositions();
    fetchAllNominees(current,filters,pageSize,searchTerm);
  }, [])

  useEffect(() => {
    if(selectedTab===0)
      fetchAllNominees(1,filters,5,searchTerm);
    else if(selectedTab === 1)
      fetchSharedNominees(1,filters,5,searchTerm);
    else 
      fetchCVs(1,filters,5,searchTerm);
    console.log(filters);
  }, [filters,searchTerm]);

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
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}/api/positions/get-all-nominees/${companyId}`
      );
      setPositions(response.data.positions);
    } catch (error) {
      console.error("Positions fetching failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSharedNominees=async(current, filters, pageSize, searchTerm)=>{
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/nominee/get-shared`,
          { companyId: companyId,  filters: filters, page: current, pageSize: pageSize, searchTerm: searchTerm }
      )
      const sharedCvs=response.data.sharedNominees;
      setSharedItems(sharedCvs);
      setTotalCvsCount(response.data.totalCvsCount);
    } catch (error) {
      console.error(error);
    }finally{
      setLoading(false);
    }
  }

  const fetchAllNominees = async (current, filters, pageSize, searchTerm)=>{
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/nominee/get-all-nominees`,
          { companyId: companyId,  filters: filters, page: current, pageSize: pageSize, searchTerm: searchTerm }
      )
      const allCvs=response.data.allNominees;
      setAllNominees(allCvs);
      setTotalCvsCount(response.data.totalCvsCount);
    } catch (error) {
      console.error(error);
    }finally{
      setLoading(false);
    }
  }
  

  const fetchCVs = async (current, filters, pageSize, searchTerm) => {

    setLoading(true);
    try {
      const postResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/nominee/get-nominees`,
        { companyId: companyId, isAdmin: false, filters: filters, page: current, pageSize: pageSize, searchTerm: searchTerm }
      );
      // const shared = postResponse.data.sharedNominees;
      const cvPool = postResponse.data.allCvs;
      // setSharedItems(shared);
      setCvs(cvPool);
      setTotalCvsCount(postResponse.data.totalCvsCount);
      console.log("count:" + totalCvsCount);
      //getAllFavorites(shared, cvPool);
    } catch (error) {
      setError(error.message);
    }finally{
      setLoading(false);
    }
   
  };

  const handleSearch = useCallback(
    debounce(async (value) => {
      setSearchTerm(value.toLowerCase());
    }, 300),
    [searchTerm]
  );

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

  const onShowSizeChange = async (current, pageSize) => {
    setCurrent(current);
    console.log("current:" + current)
    setPageSize(pageSize);
    console.log("page size:" + pageSize);
    if(selectedTab===0)
      fetchAllNominees(current,filters,pageSize,searchTerm);
    else if(selectedTab === 1)
      fetchSharedNominees(current,filters,pageSize,searchTerm);
    else 
      fetchCVs(current,filters,pageSize,searchTerm);
  };
  
  const locale = {
    jump_to: t("GoTo"),
    page: t("Page"),
    items_per_page: "/ " + t("Page"),
  };

  return (
    <>
      
      <div className="flex flex-row justify-evenly  bg-[#FAFAFA]">
        <div
          className="hidden sideFilter  sm:flex  sm:flex-col sm:w-[280px] md:w-[30%]
             p-2"
        >
          <FilterComponent
            setFilters={setFilters}
            parameterOptions={parameterOptions}
            isHorizontal={false}
            setCheckedItems={setCheckedItems}
            checkedItems={checkedItems}
          />
        </div>

        <div className="flex flex-col w-full contentCV overflow-hidden ">
          <div className="justify-center items-center pt-6">
            <div className="flex flex-col h-max border   lg:flex-row bg-white lg:justify-between items-center rounded-xl m-2">
              <div className="flex flex-row justify-start items-center ml-2 p-2">
                <button
                  className={`flex items-center border-b-2  justify-center m-2 ${selectedTab === 0 ? "border-b-2  border-blue-400" : "border-white"
                    } `}
                  onClick={() => handleTabChange(0)}
                >
                  {t("listCandidates.all_nominees")}
                </button>
                <button
                  className={`flex items-center border-b-2 justify-center m-2 ${selectedTab === 1 ? "border-b-2  border-blue-400" : "border-white"
                    } `}
                  onClick={() => handleTabChange(1)}
                >
                  {t("listCandidates.shared_with_me")}
                </button>
                <button
                  className={`flex items-center border-b-2 justify-center m-2 ${selectedTab === 2 ? "border-b-2  border-blue-400" : "border-white"
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
            {loading ? (
              <Loading />
            ) : (
              <div className="contentPool">
                {selectedTab === 0 && (
                  <>
                    <div className="cols-span-1 s:mp-4 md:border-r-2">
                      <ul>
                        {allNominees.map((nominee, index) => (
                          <NomineeCard
                            key={index}
                            nominee={nominee.nomineeInfo}
                            companyId={companyId}
                            searchTerm={searchTerm}
                            positionRoute={nominee.position?.id}
                            known={nominee?.isShared}
                            position={positions}
                          />
                        ))}
                      </ul>
                      <Pagination
                      className="w-full   flex justify-end pr-20"
                      showQuickJumper
                      locale={locale}
                      total={totalCvsCount}
                      onChange={onShowSizeChange}
                      showSizeChanger
                      current={current}
                      pageSize={pageSize}
                      pageSizeOptions={["1", "5", "10", "50"]}
                    />
                    </div>
                  </>
                )}
                {selectedTab === 1 && (
                  <div className="cols-span-1 mp-4 md:border-r-2">
                    <ul>
                      {sharedItems.map((nominee, index) => (
                        <NomineeCard
                          key={index}
                          nominee={nominee.nomineeInfo}
                          companyId={companyId}
                          searchTerm={searchTerm}
                          positionRoute={nominee.position.id}
                          known={true}
                        />
                      ))}
                    </ul>
                    <Pagination
                      className="w-full   flex justify-end pr-20"
                      showQuickJumper
                      locale={locale}
                      total={totalCvsCount}
                      onChange={onShowSizeChange}
                      showSizeChanger
                      current={current}
                      pageSize={pageSize}
                      pageSizeOptions={["5", "10", "20", "50"]}
                    />
                  </div>
                )}
                {selectedTab === 2 && (
                  <div className="relative h-full">
                    <div className="cols-span-1 overflow-auto mp-4 md:border-r-2">
                      {cvs.map((nominee, index) => (
                        <NomineeCard
                          key={index}
                          nominee={nominee}
                          companyId={companyId}
                          searchTerm={searchTerm}
                          known={false}
                          position={positions}
                        />
                      ))}
                    </div>
                    <Pagination
                      className="w-full   flex justify-end pr-20"
                      showQuickJumper
                      locale={locale}
                      total={totalCvsCount}
                      onChange={onShowSizeChange}
                      showSizeChanger
                      current={current}
                      pageSize={pageSize}
                      pageSizeOptions={["5", "10", "20", "50"]}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
    </>
  );
};

export default CVList;
