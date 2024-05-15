import React, { useState, useEffect } from "react";
import axios from "axios";
import { getIdFromToken } from "../utils/getIdFromToken";
import { Button, Drawer, Input, Popconfirm } from "antd";
import Loading from "../components/loadingComponent";
import Notification from "../utils/notification";
import { useTranslation } from "react-i18next";
import { DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { AiFillLeftCircle } from "react-icons/ai";
import parametersIcon from "../assets/pencil.svg";

const CustomerParameters = () => {
  const { t } = useTranslation();
  const [editingParameter, setEditingParameter] = useState(null);
  const [industries, setIndustries] = useState([]);
  const [newIndustry, setNewIndustry] = useState("");
  const [companies, setCompanies] = useState([]);
  const [newCompany, setNewCompany] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editedValues, setEditedValues] = useState([]);
  const [title, setTitle] = useState("");
  const [isEdit, setEdit] = useState(false);
  const [value, setValue] = useState("");
  const toggleDrawer = () => {
    setModalOpen(!modalOpen);
    if (!modalOpen) {
      fetchIndustries();
      fetchCompanies();
    }
  };
  const customerId = getIdFromToken(localStorage.getItem("token"));
  const apiUrl = process.env.REACT_APP_API_URL;
  useEffect(() => {
    fetchIndustries();
    fetchCompanies();

  }, []);
  useEffect(() => {
    setEditedValues(industries);
  }, [industries]);
  useEffect(() => {
    setEditedValues(companies);
  }, [companies]);

  const fetchIndustries = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/customers/get-industry/${customerId}`
      );
      setIndustries(response.data.industries);
    } catch (error) {
      console.error("Error fetching industries:", error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/customers/get-companies/${customerId}`
      );
      setCompanies(response.data.companies);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const addIndustry = async (value) => {
    try {
      await axios.put(`${apiUrl}/api/customers/add-industry/${customerId}`, {
        industry: value,
      });
      fetchIndustries();
      setNewIndustry("");
    } catch (error) {
      console.error("Error adding industry:", error);
    }
  };

  const deleteIndustry = async (industryToDelete) => {
    try {
      await axios.put(`${apiUrl}/api/customers/delete-industry/${customerId}`, {
        industry: industryToDelete,
      });

    } catch (error) {
      console.error("Error deleting industry:", error);
    }
    fetchIndustries();
    setEditedValues(industries);
  };
  const deleteCompany = async (companyToDelete) => {
    try {
      await axios.put(`${apiUrl}/api/customers/delete-company/${customerId}`, {
        company: companyToDelete,
      });
      fetchCompanies();
    } catch (error) {
      console.error("Error deleting company:", error);
    }

  };
  const handleSearch = (e) => {
    const searchText = e.target.value.toLowerCase();
    setSearchText(searchText);
  };
  const handleEditClick = (parameter) => {
    setEditedValues(parameter);
    setEditingParameter(parameter);
    setModalOpen(true);
  };
  const handleAdd = () => {
    if (editedValues.some((value) => value.trim() === "")) {
      alert(t("customer_parameter.null_value"));
    } else {
      setEditedValues([...editedValues, ""]);
      setEdit(true);
      setTimeout(() => {
        const list = document.getElementById("editedValuesList");
        const lastItem = list.lastElementChild;
        lastItem.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100);
    }
  };

  const handleInputChange = (index, value) => {
    const newValues = [...editedValues];
    newValues[index] = value;
    setEditedValues(newValues);

  };
  const highlightText = (text, searchText) => {
    if (!searchText.trim()) return text;

    const regex = new RegExp(`(${searchText})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span
          key={index}
          style={{ fontWeight: "bold", backgroundColor: "#FDE047" }}
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };
  const handleSaveClick = async () => {

    if (
      editedValues.some((value) => value === "") ||
      editedValues.length === 0 ||
      editedValues[editedValues.length - 1] === ""
    ) {
      Notification("warning", t("customer_parameter.save_message"));

    } else {
      try {

        if (editingParameter) {
          console.log("    editing:" + editedValues);
          await axios.put(`${apiUrl}/api/customers/edit-companies/${customerId}`, {
            companies: editedValues,

          });
          console.log();
          Notification("success", t("customer_parameter.edit_success"));
        } else {
          await axios.put(`${apiUrl}/api/customers/add-company/${customerId}`, {
            company: value,
          });
        }
        await fetchCompanies();
      } catch (error) {
        console.error("Parametre kaydetme hatası:", error);
      }
      setEditingParameter(null);
      setModalOpen(false);
    }
  };
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="body">
          <div className="flex flex-row items-center w-full">
            <h1 className="text-left my-5 font-semibold ">
              {t("parameters.header")}
            </h1>
            <div className="searchButtonContainer ml-10">
              <Input
                placeholder={t("customer_parameter.search")}
                className="searchButton"
                onChange={handleSearch}
                suffix={<SearchOutlined />}
              ></Input>
            </div>
          </div>
          <div className="w-full">
            <div className="grid lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4  md:grid-cols-2 w-full h-full ">
              <div className="bg-white p-4 rounded rounded-xl md:w-full sm:w-full h-max-[200px] ">
                <div className="flex justify-between">
                  <h3 className="font-semibold text-center p-2 ">
                    {highlightText(t("customer_parameter.sectors"), searchText)}
                  </h3>
                  <div
                    className="parametersIcon w-[32px] h-[32px] bg-[#0057D9] hover:bg-[#0017D9] cursor-pointer gap-7 rounded-md flex items-center justify-center mr-2"
                    onClick={() => {
                      setTitle("Sektörler");

                      handleEditClick(industries);
                    }}
                  >
                    <img
                      src={parametersIcon}
                      alt="Resim"
                      className="size-[17px]"
                    />
                  </div>
                </div>

                <div className="flex flex-col p-2">
                  <ul
                    className="list-disc pl-6 mt-1"
                    style={{
                      maxHeight: "180px",
                      overflowY: industries.length > 4 ? "scroll" : "visible",
                    }}
                  >
                    {industries.map((sector, index) => (
                      <li className="mt-[2px]" key={index}>
                        {highlightText(sector, searchText)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="bg-white p-4 rounded rounded-xl md:w-full sm:w-full  gap-14 h-max-[100px] ">
                <div className="flex justify-between">
                  <h3 className="font-semibold text-center p-2">
                    {highlightText(t("customer_parameter.companies"), searchText)}
                  </h3>
                  <div
                    className="parametersIcon w-[32px] h-[32px] bg-[#0057D9] hover:bg-[#0017D9] cursor-pointer gap-7 rounded-md flex items-center justify-center mr-2"
                    onClick={() => {
                      setTitle("Şirketler");
                      handleEditClick(companies);
                    }}
                  >
                    <img
                      src={parametersIcon}
                      alt="Resim"
                      className="size-[17px]"
                    />
                  </div>
                </div>
                <div className="flex flex-col p-2">
                  <ul
                    className="list-disc pl-6 mt-1"
                    style={{
                      maxHeight: "180px",
                      overflowY: companies.length > 4 ? "scroll" : "visible",
                    }}
                  >
                    {companies.map((company, index) => (
                      <li className="mt-[2px]" key={index}>
                        {highlightText(company, searchText)}

                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <Drawer
                title={
                  <div className="w-full">
                    {title === "Sektörler" ? (
                      <p className="mr-5">{t("customer_parameter.sectors")}</p>
                    ) : title === "Şirketler" ? (
                      <p className="mr-5">{t("customer_parameter.companies")}</p>
                    ) : null}


                    <div
                      className="cursor-pointer bg-[#0057D9] hover:bg-[#0037D9] w-[35px] h-[35px] mt-[-30px] rounded-full absolute right-6 flex items-center justify-center"
                      onClick={handleAdd}
                    >
                      <PlusOutlined className="text-white w-[15px] h-[15px] font-semibold" />
                    </div>
                  </div>
                }
                headerStyle={{
                  marginTop: "20px",
                  borderBottom: "none",
                  textAlign: "center",
                  fontfamily: "SF Pro Text",
                  fontWeight: "500",
                  fontSize: "20px",
                  lineHeight: "24px",
                  marginRight: "50px",
                }}
                placement="right"
                closeIcon={
                  <AiFillLeftCircle className="w-[40px] h-[40px] text-[#0057D9] hover:text-[#0050D9]" />
                }
                onClose={toggleDrawer}
                visible={modalOpen}
              >
                <div className="h-full relative ">
                  <ul id="editedValuesList">
                    {editedValues.map((value, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-around mt-1"
                      >
                        <Input

                          type="text"
                          className="rounded shadow-sm "
                          value={value}
                          onChange={(e) => {
                            handleInputChange(index, e.target.value);
                            setValue(e.target.value);

                          }}

                        />
                        <Popconfirm
                          title={t("parameters.pop-up.title")}
                          description={t("parameters.pop-up.message")}
                          onConfirm={() => {
                            if (title === "Sektörler") {
                              deleteIndustry(value);
                            } else deleteCompany(value);
                          }}
                          okText={t("parameters.pop-up.ok_message")}
                          okType="danger"
                          cancelText={t("parameters.pop-up.cancel_message")}
                        >
                          <Button
                            type="primary"
                            icon={<DeleteOutlined />}
                            className="cursor-pointer bg-[#FF4747] hover:bg-[#FF4747] shadow-xl text-white py-1 px-2 rounded ml-2"
                          ></Button>
                        </Popconfirm>
                      </li>
                    ))}
                  </ul>
                  <div className="flex  mt-3 w-full py-3">
                    <Button
                      type="primary"
                      onClick={() => {
                        if (title === "Sektörler") {
                          addIndustry(value);
                        } else handleSaveClick()
                      }}
                      className="w-full bg-[#0057D9]"
                    >
                      {t("parameters.button-text")}
                    </Button>
                  </div>
                </div>
              </Drawer>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerParameters;
