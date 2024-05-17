import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import filterFunction from "../utils/globalSearchFunction";
import { useNavigate, useParams } from "react-router-dom";
import ListComponent from "../components/listComponent";
import { setSelectedOption } from "../redux/selectedOptionSlice";
import { useSelector, useDispatch } from "react-redux";
import Notification from "../utils/notification";
import FilterComponent from "../components/filterComponent";
import { highlightSearchTerm } from "../utils/highLightSearchTerm";
import Loading from "../components/loadingComponent";
import socket from "../config/config";
import { useTranslation } from "react-i18next";
import { Avatar, Badge, Button, Input, Pagination, Space, Table, Tooltip } from "antd";
import { EditOutlined, InfoCircleOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import ConfirmPopUp from "../components/areUSure";
import { debounce } from "lodash";

const AdminListPosition = () => {
  const { t } = useTranslation();
  const [positions, setPositions] = useState([]);
  const [requestedNominees, setRequestedNominees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPositions, setTotalPositions] = useState(0);
  const dispatch = useDispatch();
  const selectedOption = useSelector(
    (state) => state.selectedOption.selectedOption
  );
  const [checkedItems, setCheckedItems] = useState([]);
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
      title: t("admin_detail.company_name"),
      dataIndex: "companyName",
      key: "companyName",
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
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
    tag: job.tag,
    worktype: job.worktype,
    companyId: job.companyId,
    companyName: job.companyName,
    requestedNominees: job.requestedNominees,
  }));
  const [parameterOptions, setParameterOptions] = useState([]);
  const [companyNames, setCompanyNames] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchPositions(page, pageSize, searchTerm);
    fetchParameterOptions();
    fetchCompanyNames();
  }, []);

  useEffect(() => {
    socket.on("positionListUpdated", (positions) => {
      setPositions(positions);
    });
  }, []);
  useEffect(() => {
    setPage(1);
    fetchPositions(1, pageSize, searchTerm);
  }, [filters]);

  const fetchPositions = async (currentPage, pageSize, search) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/positions`,
        {
          params: {
            page: currentPage,
            pageSize: pageSize,
            companyName: filters.companyName,
            jobtitle: filters.jobtitle,
            department: filters.department,
            experienceperiod: filters.experienceperiod,
            modeofoperation: filters.modeofoperation,
            worktype: filters.worktype,
            skills: filters.skills,
            search: search,
          },
        }
      );
      setPositions(response.data.positions);
      setTotalPositions(response.data.totalCount);
    } catch (error) {
      console.error("Positions fetching failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyNames = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/customers`
      );
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
      setLoading(false);
    } catch (error) {
      console.error("Parameter options fetching failed:", error);
    }
  };

  const handleDeletePosition = async (positionId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/positions/${positionId}`
      );
      setPositions(
        positions.filter((position) => position.positionId !== positionId)
      );
      Notification("success", "Pozisyon başarıyla silindi.", "");
      fetchPositions(page, pageSize, searchTerm);
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

  const handleEditPosition = (positionId) => {
    navigate(`/edit-position/${positionId}`);
  };
  const handlePageChange = (newPage, pageSize) => {
    setPage(newPage);
    setPageSize(pageSize);
    fetchPositions(newPage, pageSize, searchTerm);
  };
  const handleSearch = useCallback(
    debounce(async (event) => {
      const { value } = event.target;
      setSearchTerm(value.toLowerCase());
      setPage(1);
      await fetchPositions(1, pageSize, value);
    }, 300),
  );
  const locale = {
    jump_to: t("GoTo"),
    page: t("Page"),
    items_per_page: "/ " + t("Page"),
  };
  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row justify-evenly  bg-[#FAFAFA]">
          <div
            className="hidden sideFilter  sm:flex  sm:flex-col sm:w-[280px] md:w-[30%]
             "
          >
            <FilterComponent
              setFilters={setFilters}
              parameterOptions={parameterOptions}
              isHorizontal={false}
              checkedItems={checkedItems}
              setCheckedItems={setCheckedItems}
            />
          </div>
          <div className="flex flex-col w-full contentCV overflow-auto ">

            <div className="bodyContainer">
              <div className="searchFilterButton">
                <div className="search">
                  <div className="searchButtonContainer">
                    <Input
                      placeholder={t("search_placeholder")}

                      className="searchButton"
                      onChange={handleSearch}
                      suffix={<SearchOutlined />}
                    ></Input>
                  </div>
                </div>
                <div className="crudButtons">

                  <Button
                    type="primary"
                    onClick={() => handleAddPosition()}
                    icon={<PlusOutlined />}
                    size="large"
                    className="buttonAdd"
                  >
                    {t("new_record")}
                  </Button>

                </div>
              </div>
              <div className="listContent">
                <div className="title">
                  <h4 className="titleLabel">Pozizsyon Listesi</h4>
                  <p className="titleContent">
                    {t("total_results", { count: totalPositions })}
                  </p>
                </div>
                <div className="listData">
                  {loading ? (
                    <Loading />
                  ) : (
                    <div className="onlyData">
                      <Table
                        columns={[
                          ...columns,
                          {
                            title: t("actions"),
                            key: "action",
                            render: (text, record) => (
                              <Space
                                size="small"
                                className="flex justify-center items-center"
                              >

                                <Tooltip
                                  placement={"top"}
                                  title={t("profile.buttons.edit")}
                                >
                                  <Button
                                    type="link"
                                    icon={<EditOutlined />}
                                    onClick={() => {
                                      handleEditPosition(record.id);
                                    }}
                                  ></Button>
                                </Tooltip>
                                <ConfirmPopUp
                                  handleDelete={handleDeletePosition}
                                  id={record.id}
                                  isConfirm={false}
                                />
                                <Tooltip placement={"top"} title={t("details")}>
                                  <button onClick={() => handlePositionDetails(record.id)}>
                                    <Badge
                                      count={record.requestedNominees?.length}
                                      className=""
                                      size="small"
                                    >
                                      <Avatar
                                        className="bg-white text-blue-500"
                                        shape="square"
                                        icon={<InfoCircleOutlined />}
                                        size="medium"
                                      />
                                    </Badge>
                                  </button>
                                </Tooltip>
                              </Space>
                            ),
                          },
                        ]}
                        dataSource={data}
                        mobileBreakPoint={768}
                        pagination={false}
                      />
                      <Pagination
                        className="flex justify-end pb-10 mt-5"
                        total={totalPositions}
                        pageSize={pageSize}
                        current={page}
                        onChange={handlePageChange}
                        showSizeChanger
                        showQuickJumper
                        locale={locale}
                        pageSizeOptions={["5", "10", "20", "50"]}
                      />
                    </div>)}
                </div>
              </div>
              <div className="footer"></div>

            </div>

          </div>


        </div>

      </div>
    </>
  )
}

export default AdminListPosition;