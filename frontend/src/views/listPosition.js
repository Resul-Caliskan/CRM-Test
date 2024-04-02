import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import filterFunction from "../utils/globalSearchFunction";
import Notification from "../utils/notification";

import { getIdFromToken } from "../utils/getIdFromToken";
import { useSelector, useDispatch } from "react-redux";
import { setUserSelectedOption } from "../redux/userSelectedOptionSlice";
import ListComponent from "../components/listComponent";
import FilterComponent from "../components/filterComponent"
import { highlightSearchTerm } from "../utils/highLightSearchTerm";
import Loading from '../components/loadingComponent';
const ListPosition = () => {
  const navigate = useNavigate();
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;
  const companyId = getIdFromToken(localStorage.getItem("token"));
  const [searchTerm, setSearchTerm] = useState("");
  const [parameterOptions, setParameterOptions] = useState([]);
  const userSelectedOption = useSelector(
    (state) => state.userSelectedOption.userSelectedOption
  );
  const dispatch = useDispatch();


  useEffect(() => {
    fetchParameterOptions();
    fetchPositions();
  }, []);

  const handleAddPosition = () => {
    dispatch(setUserSelectedOption("add-position"));
  };


  const fetchPositions = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/positions/get/${companyId}`);
      setPositions(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Customers fetching failed:", error);
    }
  };
  const fetchParameterOptions = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/parameters`
      );
      const filteredOptions = response.data.filter(option => {
        return option.title === "İş Unvanı" || 
        option.title === "Departman" || 
        option.title === "Deneyim Süresi" || 
        option.title === "İş Türü" || 
        option.title === "Yetenekler" || 
        option.title === "İşyeri Politikası";
      });
      console.log(filteredOptions);
      setParameterOptions(filteredOptions);
    } catch (error) {
      console.error("Parameter options fetching failed:", error);
    }
  };
  const handleDeletePosition = async (positionId) => {
    console.log("Talep silindi:", positionId);
    try {
      await axios.delete(`${apiUrl}/api/positions/${positionId}`);
      Notification(true, "Başarıyla silindi");
      fetchPositions();
    } catch (error) {
      console.error("Pozisyon silinirken bir hata oluştu:", error);
      Notification(false, "Pozisyon silinirken bir hata oluştu!");
    } finally {
      setDeleteConfirmation(null);
    }
  };

  const showDeleteConfirmationModal = (positionId) => {
    setDeleteConfirmation(positionId);
  };

  const hideDeleteConfirmationModal = () => {
    setDeleteConfirmation(null);
  };

  const handleEditPosition = (positionId) => {
    navigate(`/edit-position/${positionId}`);
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

  const [filters, setFilters] = useState({

    jobtitle: [],
    department: [],
    experienceperiod: [],
    modeofoperation: [],
    worktype: [],
    skills: [],
  });
  const columns = [
    {
      title: "İş Ünvanı",
      dataIndex: "jobtitle",
      key: "jobtitle",
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    {
      title: "Departman",
      dataIndex: "department",
      key: "department",
      render: (text) => highlightSearchTerm(text, searchTerm),
    },

    {
      title: "Deneyim Süresi",
      dataIndex: "experienceperiod",
      key: "experienceperiod",
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    {
      title: "İşyeri Politikası",
      dataIndex: "modeofoperation",
      key: "modeofoperation",
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    {
      title: "İş Türü",
      dataIndex: "worktype",
      key: "worktype",
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    {
      title: "Yetenekler",
      dataIndex: "skills",
      key: "skills",
      render: (text) => {
        if (Array.isArray(text)) {
          return text.map((skill, index) => (
            <span key={index}>
              {highlightSearchTerm(skill, searchTerm)}
              {index !== text.length - 1 && " , "}
            </span>
          ));
        } else if (typeof text === "string") {
          return highlightSearchTerm(text, searchTerm);
        } else {
          return text;
        }
      },
    },

  ];
  const filteredPositions = positions.filter((position) => {
    const searchFields = [
      "jobtitle",
      "department",
      "experienceperiod",
      "modeofoperation",
      "worktype",
      "skills",
    ];

    return (
      (filters.jobtitle.length === 0 || filters.jobtitle.includes(position.jobtitle)) &&
      (filters.department.length === 0 || filters.department.includes(position.department)) &&
      (filters.experienceperiod.length === 0 || filters.experienceperiod.includes(position.experienceperiod)) &&
      (filters.modeofoperation.length === 0 || filters.modeofoperation.includes(position.modeofoperation)) &&
      (filters.worktype.length === 0 || filters.worktype.includes(position.worktype)) &&
      (filters.skills.length === 0 || position.skills.some((skill) => filters.skills.includes(skill))) &&
      (searchTerm === "" || filterFunction(searchFields, position, searchTerm.toLowerCase()))
    );
  });

  const data = filteredPositions.map((position, index) => ({
    key: index,
    id: position._id,
    department: position.department,
    jobtitle: position.jobtitle,
    experienceperiod: position.experienceperiod,
    modeofoperation: position.modeofoperation,
    description: position.description,
    skills: position.skills,
    worktype: position.worktype,
    companyId: position.companyId,
    companyName: position.companyName,
  }));


  return (
    <>
    {loading ? (
        <Loading />
      ) : (
    <ListComponent
      handleAdd={handleAddPosition}
      handleUpdate={false}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      dropdowns={<FilterComponent
        setFilters={setFilters}
        parameterOptions={parameterOptions}
      />}
      handleDelete={handleDeletePosition}
      handleDetail={handlePositionDetails}
      columns={columns}
      data={data}
      name={"Pozisyon Listesi"}
    />
      )}
      </>

  );
};

export default ListPosition;

