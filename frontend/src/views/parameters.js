import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { Button, Drawer, Input, Popconfirm } from "antd";
import Loading from "../components/loadingComponent";
import Notification from "../utils/notification";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import parametersIcon from "../assets/pencil.svg";
import { AiFillLeftCircle } from "react-icons/ai";
import { useTranslation } from "react-i18next";

const Parameters = () => {
  const [parameters, setParameters] = useState([]);
  const [editingParameter, setEditingParameter] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [editedValues, setEditedValues] = useState([]);
  const [newParameter, setNewParameter] = useState({ title: "", values: [] });
  const [selectedParameter, setSelectedParameter] = useState();
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState(""); // State for search text
  const { t, i18n } = useTranslation();
  const apiUrl = process.env.REACT_APP_API_URL;
  const toggleDrawer = () => {
    setModalOpen(!modalOpen);
  };
  useEffect(() => {
    fetchParameters();
  }, []);

  const fetchParameters = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/parameters`);
      const filteredOptions = response.data.filter((option) => {
        return (
          (option.title === "Sektör" &&
            (option.title = t("userListPosition.sector"))) ||
          (option.title === "Firma Türü" &&
            (option.title = t("userListPosition.company_type"))) ||
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
            (option.title = t("userListPosition.mode_of_operation"))) ||
          (option.title === "Şirketler" &&
            (option.title = t("userListPosition.companies")))
        );
      });
      setParameters(filteredOptions);
      setLoading(false);
    } catch (error) {
      console.error("Parameter fetching failed:", error);
    }
  };

  const handleEditClick = (parameter) => {
    setSelectedParameter(parameter.title);
    setEditingParameter(parameter);
    setEditedValues(parameter.values);
    setModalOpen(true);
  };

  const handleSaveClick = async () => {
    if (
      editedValues.some((value) => value === "") ||
      editedValues.length === 0 ||
      editedValues[editedValues.length - 1] === ""
    ) {
      Notification("warning", "Boş Bir Değer Girilemez");
    } else {
      try {
        if (editingParameter) {
          await axios.put(`${apiUrl}/api/parameters/${editingParameter._id}`, {
            values: editedValues,
          });

          Notification("success", "Düzenleme Başarılı");
        } else {
          await axios.post(`${apiUrl}/api/parameters`, {
            title: newParameter.title,
            values: newParameter.values,
          });
        }
        await fetchParameters();
      } catch (error) {
        console.error("Parametre kaydetme hatası:", error);
      }
      setEditingParameter(null);
      setModalOpen(false);
    }
  };

  const handleDelete = async (index) => {
    try {
      const newValues = [...editedValues];
      newValues.splice(index, 1);

      if (newValues.length === 0) {
        await axios.delete(`${apiUrl}/api/parameters/${editingParameter._id}`);

        const updatedParameters = parameters.filter(
          (param) => param._id !== editingParameter._id
        );
        setParameters(updatedParameters);
        setEditingParameter(null);
        setModalOpen(false);
      } else {
        setEditedValues(newValues);
      }
    } catch (error) {
      console.error("Parametre silme hatası:", error);
    }
  };

  const handleDeleteValue = async (parameterId, valueId) => {
    try {
      await axios.delete(
        `${apiUrl}/api/parameters/${parameterId}/values/${valueId}`
      );
      await fetchParameters();
    } catch (error) {
      console.error("Parametre değeri silme hatası:", error);
    }
  };

  const handleAdd = () => {
    if (
      editedValues.some((value) => value === "") ||
      editedValues.length === 0 ||
      editedValues[editedValues.length - 1] === ""
    ) {
      alert("Lütfen boş bir değer eklemeyin.");
    } else {
      setEditedValues([...editedValues, ""]);
      setEdit(true);
      setTimeout(() => {
        const list = document.getElementById("editedValuesList");
        // const lastItem = list.lastElementChild;
        // lastItem.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100);
    }
  };

  const handleEdit = () => {
    setEdit(!isEdit);
  };

  const handleInputChange = (index, value) => {
    const newValues = [...editedValues];
    newValues[index] = value;
    setEditedValues(newValues);
  };

  const handleNewParameterChange = (e) => {
    const { name, value } = e.target;
    setNewParameter((prevParameter) => ({
      ...prevParameter,
      [name]: value,
    }));
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
  const handleSearch = (e) => {
    const searchText = e.target.value.toLowerCase();
    setSearchText(searchText);
  };

  const filteredParameters = parameters.filter(
    (param) =>
      param.title.toLowerCase().includes(searchText) ||
      param.values.some((value) => value.toLowerCase().includes(searchText))
  );

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="body ">
          <div className="flex flex-row items-center w-full">
            <h1 className="text-left my-5 font-semibold ">
              {t("parameters.header")}
            </h1>
            <div className="searchButtonContainer ml-10">
              <Input
              data-test="parametersearch"
                placeholder={t("parameters.search_placeholder")}
                className="searchButton"
                onChange={handleSearch}
                suffix={<SearchOutlined />}
              ></Input>
            </div>
          </div>
          <div className="w-full">
            <div className="flex justify-between items-center w-full"></div>
            <ul className=" grid sm:grid-cols-1   md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 w-full">
              {filteredParameters.map((param) => (
                <div
                  key={param._id}
                  className="bg-white p-4 rounded rounded-xl md:w-full sm:w-full  gap-14  "
                >
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-center p-2">
                      {highlightText(param.title, searchText)}
                    </h3>
                    <div
                      className="parametersIcon w-[32px] h-[32px] bg-[#0057D9] hover:bg-[#0017D9] cursor-pointer gap-7 rounded-md flex items-center justify-center mr-2"
                      onClick={() => handleEditClick(param)}
                      data-test="editparameter"
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
                      className="list-disc pl-6 mt-1 "
                      style={{
                        maxHeight: "100px",
                        overflowY:
                          param.values.length > 4 ? "scroll" : "visible",
                      }}
                    >
                      {param.values.map((value, index) => (
                        <li className="mt-[2px]" key={`${param._id}-${index}`}>
                          {highlightText(value, searchText)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </ul>
          </div>
          <Drawer
            title={
              <div className="w-full">
                <p className="mr-5">{selectedParameter}</p>
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
              <ul id="editedValuesList ">
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
                      }}
                    />
                    <Popconfirm
                      title={t("parameters.pop-up.title")}
                      description={t("parameters.pop-up.message")}
                      onConfirm={() => handleDelete(index)}
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
                  onClick={handleSaveClick}
                  className="w-full bg-[#0057D9]"
                >
                  {t("parameters.button-text")}
                </Button>
              </div>
            </div>
          </Drawer>
        </div>
      )}
    </>
  );
};

export default Parameters;