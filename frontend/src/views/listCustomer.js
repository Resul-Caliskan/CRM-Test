import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedOption } from "../redux/selectedOptionSlice";
import ListComponent from "../components/listComponent";
import Notification from "../utils/notification";
import { highlightSearchTerm } from "../utils/highLightSearchTerm";
import FilterComponent from "../components/filterComponent";
import filterFunction from "../utils/globalSearchFunction";
import Loading from "../components/loadingComponent";
import { useTranslation } from "react-i18next";
import { Button, Input, Pagination, Space, Table, Tooltip } from "antd";
import { EditOutlined, InfoCircleOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import ConfirmPopUp from "../components/areUSure";
import { debounce } from "lodash";

const ListCustomers = () => {
  const { t, i18n } = useTranslation();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [parameterOptions, setParameterOptions] = useState([]);
  const [isDelete, setIsDelete] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [checkedItems, setCheckedItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const { user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({
    sector: [],
    companytype: [],
  });
  useEffect(() => {
    if (user?.role === "admin") {
      fetchParameterOptions();
      setIsDelete(false);
    }
  }, [isDelete]);

  useEffect(() => {
    fetchCustomers();
  }, [page, pageSize, searchTerm, filters]);

  const columns = [
    {
      title: () => t("listCustomer.company_name"),
      dataIndex: "companyname",
      key: "companyname",
      render: (text) => highlightSearchTerm(text, searchTerm),
      sorter: (a, b) => a.companyname.localeCompare(b.companyname),
    },

    {
      title: () => t("listCustomer.company_sector"),
      dataIndex: "companysector",
      key: "companysector",
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    {
      title: () => t("listCustomer.company_country"),
      dataIndex: "companycountry",
      key: "companycountry",
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    {
      title: () => t("listCustomer.company_city"),
      dataIndex: "companycity",
      key: "companycity",
      render: (text) => highlightSearchTerm(text, searchTerm),
      sorter: (a, b) => a.companycity.localeCompare(b.companycity),
    },
    {
      title: () => t("listCustomer.company_contactName"),
      dataIndex: "contactname",
      key: "contactname",
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    {
      title: () => t("listCustomer.company_contactMail"),
      dataIndex: "contactmail",
      key: "contactmail",
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    {
      title: () => t("listCustomer.company_contactNumber"),
      dataIndex: "contactnumber",
      key: "contactnumber",
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
  ];
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/customers`,
        {
          params: {
            page:page,
            pageSize:pageSize,
            searchTerm:searchTerm,
            sector:filters.sector,
            companytype:filters.companytype
             // Send filters as a JSON string
          },
        }
      );
      setCustomers(response.data.customers);
      setTotalCustomers(response.data.totalCustomers);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchParameterOptions = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/parameters`
      );
      const filteredOptions = response.data.filter((option) => {
        return (
          (option.title === "Sektör" &&
            (option.title = t("userListPosition.sector"))) ||
          (option.title === "Firma Türü" &&
            (option.title = t("userListPosition.company_type")))
        );
      });
      setParameterOptions(filteredOptions);
    } catch (error) {
      console.error("Parameter options fetching failed:", error);
    }
  };

  const handleEditCustomer = (customerId) => {
    navigate(`/edit-customer/${customerId}`);
  };
  const handleDetailCustomer = (customerId) => {
    navigate(`/detail-customer/${customerId}`);
  };
  const handleSearch = useCallback(
    debounce(async (value) => {
      if (typeof value === 'string') {
        setSearchTerm(value.toLowerCase());
      } else {
        console.error('Search term is not a string:', value);
      }
    }, 300),
    []
  );


  const handleAddCustomer = () => {
    dispatch(setSelectedOption("add-customer"));
  };
  const handleDelete = async (customerId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/customers/${customerId}`
      );
      setCustomers(
        customers.filter((customer) => customer.companyId !== customerId)
      );
      Notification("success", t("customer_deleted_success"), "");
      setIsDelete(true);
    } catch (error) {
      Notification("error", t("customer_deletion_error"), "");
    }
  };
  const handlePageChange = (newPage, newPageSize) => {
    setPage(newPage);
    setPageSize(newPageSize);

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
          className="hidden sideFilter  sm:flex  sm:flex-col sm:w-[280px] md:w-[30%]">
          <FilterComponent
            setFilters={setFilters}
            parameterOptions={parameterOptions}
            isHorizontal={false}
            checkedItems={checkedItems}
            setCheckedItems={setCheckedItems}
          />
        </div>
        <div className="flex flex-col w-full contentCV overflow-y-auto ">
          <div className="bodyContainer">
            <div className="searchFilterButton">
              <div className="search">
                <div className="searchButtonContainer">
                  <Input
                    placeholder={t("search_placeholder")}
                    className="searchButton"
                    onChange={(e) => handleSearch(e.target.value)}
                    suffix={<SearchOutlined />}
                  />
                </div>
              </div>
              <div className="crudButtons">

                <Button
                  type="primary"
                  onClick={handleAddCustomer}
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
                <h4 className="titleLabel">{t("listCustomer.company_list")}</h4>
                <p className="titleContent">
                  {t("total_results", { count: customers.length })}
                </p>
              </div>
              <div className="listData">
                <div className="onlyData">
                  {loading ? (
                    <Loading />
                  ) : (<Table
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
                                  handleEditCustomer(record._id);
                                }}
                              ></Button>
                            </Tooltip>

                            <ConfirmPopUp
                              handleDelete={handleDelete}
                              id={record._id}
                              isConfirm={false}
                            />

                            <Tooltip placement={"top"} title={t("details")}>
                              <Button
                                type="link"
                                icon={<InfoCircleOutlined />}
                                onClick={() => handleDetailCustomer(record._id)}
                              ></Button>
                            </Tooltip>

                          </Space>
                        ),
                      },


                    ]}
                    dataSource={customers}
                    pagination={false}
                    mobileBreakPoint={768}
                  />)}
                  <Pagination
                    className="flex justify-end pb-10 mt-5"
                    total={totalCustomers}
                    pageSize={pageSize}
                    current={page}
                    onChange={handlePageChange}
                    showSizeChanger
                    showQuickJumper
                    locale={locale}
                    pageSizeOptions={["1", "2", "5", "50"]}
                  />
                </div>
              </div>
            </div>
            <div className="footer"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListCustomers;
