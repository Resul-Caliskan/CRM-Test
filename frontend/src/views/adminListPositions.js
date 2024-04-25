
import React, { useState, useEffect } from "react";
import axios from "axios";
import filterFunction from "../utils/globalSearchFunction";
import Highlighter from "react-highlight-words";
import SearchInput from '../components/searchInput';
import { useNavigate, useParams } from "react-router-dom";
import ListComponent from "../components/listComponent";
import { setSelectedOption } from "../redux/selectedOptionSlice";
import { useSelector, useDispatch } from "react-redux";
import Notification from "../utils/notification";
import FilterComponent from "../components/filterComponent"
import { highlightSearchTerm } from "../utils/highLightSearchTerm";
import Loading from '../components/loadingComponent';
const AdminListPosition = () => {
  const [positions, setPositions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const selectedOption = useSelector(
    (state) => state.selectedOption.selectedOption
  );

  const [filters, setFilters] = useState({
    companyName: [],
    jobtitle: [],
    department: [],
    experienceperiod: [],
    modeofoperation: [],
    worktype: [],
    skills: [],
  });
  const columns = [
    {
      title: "Şirket Adı",
      dataIndex: "companyName",
      key: "companyName",
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    {
      title: "Departman",
      dataIndex: "department",
      key: "department",
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    {
      title: "İş Ünvanı",
      dataIndex: "jobtitle",
      key: "jobtitle",
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    {
      title: "Deneyim Süresi",
      dataIndex: "experienceperiod",
      key: "experienceperiod",
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    // {
    //   title: "İşyeri Politikası",
    //   dataIndex: "modeofoperation",
    //   key: "modeofoperation",
    //   render: (text) => highlightSearchTerm(text, searchTerm),
    // },
    {
      title: "Çalışma Şekli",
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
      "positionname",
      "department",
      "jobtitle",
      "experienceperiod",
      "modeofoperation",
      "worktype",
      "companyName",
      "skills",
    ];

    const {
      companyName,
      jobtitle,
      department,
      experienceperiod,
      modeofoperation,
      worktype,
      skills,
    } = filters;

    return (
      (companyName.length === 0 ||
        companyName.includes(position.companyName)) &&
      (jobtitle.length === 0 || jobtitle.includes(position.jobtitle)) &&
      (department.length === 0 || department.includes(position.department)) &&
      (experienceperiod.length === 0 ||
        experienceperiod.includes(position.experienceperiod)) &&
      (modeofoperation.length === 0 ||
        modeofoperation.includes(position.modeofoperation)) &&
      (worktype.length === 0 || worktype.includes(position.worktype)) &&
      (skills.length === 0 ||
        position.skills.some((skill) => skills.includes(skill))) &&
      (searchTerm === "" ||
        filterFunction(searchFields, position, searchTerm.toLowerCase()))
    );
  });
  const data = filteredPositions.map((job, index) => ({
    key: index,
    id: job._id,
    department: job.department,
    jobtitle: job.jobtitle,
    experienceperiod: job.experienceperiod,
    modeofoperation: job.modeofoperation,
    description: job.description,
    skills: job.skills,
    worktype: job.worktype,
    companyId: job.companyId,
    companyName: job.companyName,
  }));
  const [parameterOptions, setParameterOptions] = useState([]);
  const [companyNames, setCompanyNames] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchPositions();
    fetchParameterOptions();
    fetchCompanyNames();
  }, []);

  const fetchPositions = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/positions`);
      setPositions(response.data);
    } catch (error) {
      console.error("Positions fetching failed:", error);
    }
  };

  const fetchCompanyNames = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers`);
      setCompanyNames(response.data);
    } catch (error) {
      console.error("Positions fetching failed:", error);
    }
  };

  const fetchParameterOptions = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/parameters`
      );
      const filteredOptions = response.data.filter(option => {
        return option.title === "Departman" ||  option.title === "İş Unvanı" || option.title === "Deneyim Süresi" || option.title === "Çalışma Şekli" || option.title === "Yetenekler";
      });
      setParameterOptions(filteredOptions);
      setLoading(false);
    } catch (error) {
      console.error("Parameter options fetching failed:", error);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [field]: value }));
  };

  const getParameterValues = (parameterTitle) => {
    const parameter = parameterOptions.find(
      (param) => param.title === parameterTitle
    );
    return parameter ? parameter.values : [];
  };
  const handleDeletePosition = async (positionId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/positions/${positionId}`);
      setPositions(positions.filter(position => position.positionId !== positionId));
      Notification("success", "Pozisyon başarıyla silindi.", "");
      fetchPositions();
      fetchParameterOptions();
      fetchCompanyNames();

    } catch (error) {
      Notification("error", "Pozisyon silinirken bir hata oluştu.", "");
    }
  };



  const handlePositionDetails = (positionId) => {
    if (positionId) {
      navigate(`/admin-position-detail/${positionId}`);
    } else {
      console.error(
        "Pozisyon detayları alınamadı: Pozisyon bilgileri eksik veya geçersiz."
      );
    }
  };
  const handleAddPosition = () => {
    dispatch(setSelectedOption("add-position"));
  };
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleEditPosition = (positionId) => {
    navigate(`/edit-position/${positionId}`);
  };
  return (
    <>
    {loading ? <Loading /> 
       : (
    <ListComponent
      handleAdd={handleAddPosition}
      handleUpdate={handleEditPosition}
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
    />)}
    </>
  );
};

export default AdminListPosition;
