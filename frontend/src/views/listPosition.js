import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import filterFunction from "../utils/globalSearchFunction";
import Notification from "../utils/notification";
import { getIdFromToken } from "../utils/getIdFromToken";
import { useSelector, useDispatch } from "react-redux";
import { setUserSelectedOption } from "../redux/userSelectedOptionSlice";
import ListComponent from "../components/listComponent";
import FilterComponent from "../components/filterComponent";
import { highlightSearchTerm } from "../utils/highLightSearchTerm";
import Loading from "../components/loadingComponent";
import { useTranslation } from "react-i18next";

const ListPosition = () => {
  const { t } = useTranslation();
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
      const response = await axios.get(
        `${apiUrl}/api/positions/get/${companyId}`
      );
      setPositions(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Customers fetching failed:", error);
    }
  };
  const fetchParameterOptions = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/parameters`
      );
      const filteredOptions = response.data.filter((option) => {
        return (
          (option.title === "İş Unvanı" &&
            (option.title = t("userListPosition.job_title"))) ||
          (option.title === "Departman" &&
            (option.title = t("userListPosition.department"))) ||
          (option.title === "Deneyim Süresi" &&
            (option.title = t("userListPosition.experience_period"))) ||
          (option.title === "Sözleşme Tipi" &&
            (option.title = t("userListPosition.work_type"))) ||
          (option.title === "Yetenekler" &&
            (option.title = t("userListPosition.skills"))) ||
          (option.title === "Çalışma Şekli" &&
            (option.title = t("userListPosition.mode_of_operation")))
        );
      });
      setParameterOptions(filteredOptions);
    } catch (error) {
      console.error("Parameter options fetching failed:", error);
    }
  };
  const handleDeletePosition = async (positionId) => {
    try {
      await axios.delete(`${apiUrl}/api/positions/${positionId}`);
      Notification(
        "success",
        t("userListPosition.position_deleted_successfully"),
        ""
      );
      fetchPositions();
    } catch (error) {
      console.error("An error occurred while deleting position:", error);
      Notification("error", t("userListPosition.error_deleting_position"), "");
    } finally {
      setDeleteConfirmation(null);
    }
  };
  const handleEditPosition = (positionId) => {
    navigate(`/edit-position/${positionId}`);
  };

  const handlePositionDetails = (positionId) => {
    if (positionId) {
      navigate(`/position-detail/${positionId}`);
    } else {
      console.error(
        "Position details could not be retrieved: Position information is incomplete or invalid."
      );
    }
  };

  const [filters, setFilters] = useState({
    jobtitle: [],
    department: [],
    tag:[],
    experienceperiod: [],
    modeofoperation: [],
    worktype: [],
    skills: [],
  });
  const columns = [
    {
      title: t("userListPosition.job_title"),
      dataIndex: "jobtitle",
      key: "jobtitle",
      render: (text, record) => (
        <span
          style={{ cursor: "pointer", textDecoration: "underline" }}
          onClick={() => handlePositionDetails(record.id)}
        >
          {highlightSearchTerm(text, searchTerm)}
        </span>
      ),
    },
    {
      title: t("position_detail.tag"),
      dataIndex: "tag",
      key: "tag",
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    {
      title: t("userListPosition.department"),
      dataIndex: "department",
      key: "department",
      render: (text) => highlightSearchTerm(text, searchTerm),
    },


    {
      title: t("userListPosition.experience_period"),
      dataIndex: "experienceperiod",
      key: "experienceperiod",
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    {
      title: t("userListPosition.mode_of_operation"),
      dataIndex: "modeofoperation",
      key: "modeofoperation",
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    {
      title: t("userListPosition.work_type"),
      dataIndex: "worktype",
      key: "worktype",
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    {
      title: t("userListPosition.skills"),
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
      (filters.jobtitle.length === 0 ||
        filters.jobtitle.includes(position.jobtitle)) &&
      (filters.department.length === 0 ||
        filters.department.includes(position.department)) &&
      (filters.experienceperiod.length === 0 ||
        filters.experienceperiod.includes(position.experienceperiod)) &&
      (filters.modeofoperation.length === 0 ||
        filters.modeofoperation.includes(position.modeofoperation)) &&
      (filters.worktype.length === 0 ||
        filters.worktype.includes(position.worktype)) &&
      (filters.skills.length === 0 ||
        position.skills.some((skill) => filters.skills.includes(skill))) &&
      (searchTerm === "" ||
        filterFunction(searchFields, position, searchTerm.toLowerCase()))
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
    tag : position.tag,
    worktype: position.worktype,
    companyId: position.companyId,
    companyName: position.companyName,
  }));

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-row justify-evenly  bg-[#FAFAFA]">
          <div className="hidden sideFilter  sm:flex  sm:flex-col sm:w-[280px] md:w-[30%]">
            <FilterComponent
              setFilters={setFilters}
              parameterOptions={parameterOptions}
              isHorizontal={false}
            />
          </div>
          <div className="flex flex-col w-full contentCV overflow-auto ">
            <ListComponent
              handleAdd={handleAddPosition}
              handleUpdate={handleEditPosition}
              searchTerm={searchTerm}
              name={t("position_list")}
              setSearchTerm={setSearchTerm}
              dropdowns={
                <FilterComponent
                  setFilters={setFilters}
                  parameterOptions={parameterOptions}
                />
              }
              handleDelete={handleDeletePosition}
              handleDetail={handlePositionDetails}
              columns={columns}
              data={data}
              title={t("userListPosition.position_list")}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ListPosition;
