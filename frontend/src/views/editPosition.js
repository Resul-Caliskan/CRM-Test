import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Spin,
  DatePicker,
  Modal,
  Tooltip,
} from "antd";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedOption } from "../redux/selectedOptionSlice";
import { setUserSelectedOption } from "../redux/userSelectedOptionSlice";
import { login } from "../redux/authSlice";
import { fetchData } from "../utils/fetchData";
import { useNavigate, useParams } from "react-router-dom";
import Notification from "../utils/notification";
import UserNavbar from "../components/userNavbar";
import EditableContent from "../components/htmlEditor";
import Loading from "../components/loadingComponent";
import NavBar from "../components/adminNavBar";
import { City, Country, State } from "country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useTranslation } from "react-i18next";

import dayjs from "dayjs";
import { ArrowLeftOutlined, InfoCircleOutlined } from "@ant-design/icons";
dayjs.extend(customParseFormat);
const dateFormat = "DD-MM-YYYY";
const today = dayjs();
const { Option } = Select;

const EditPosition = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [positionData, setPositionData] = useState(null);
  const [parameters, setParameters] = useState([]);
  const [aiResponse, setAiResponse] = useState(" ");
  const [contentValue, setcontentValue] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [isFetch, setIsFetch] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [state, setState] = useState();
  const [stateData, setstateData] = useState();
  const [countyData, setCountyData] = useState();
  const [county, setCounty] = useState();
  const [industry, setIndustry] = useState(null);
  const [country, setCountry] = useState();
  const [bannedCompanies, setBannedCompanies] = useState(null);
  let countryData = Country.getAllCountries();
  const [preferredCompanies, setPreferredCompanies] = useState(null);
  const [isoCode, setIsoCode] = useState("");
  const { user } = useSelector((state) => state.auth);
  const [visible, setVisible] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!user || user.role === null) {
      fetchData()
        .then((data) => {
          dispatch(login(data.user));
        })
        .catch((error) => {
          console.error(error);
        });
    }
    if (isFetch) {
      fetchPosition();
    }
    if (!parameters.length) {
      fetchParameters();
    }

    form.setFieldsValue({ description: contentValue });
    const values = form.getFieldsValue();
  }, [id, form, contentValue, user]);

  useEffect(() => {
    setstateData(State.getStatesOfCountry(isoCode));
  }, [isoCode]);
  useEffect(() => {
    setCountyData(City.getCitiesOfState(isoCode, state?.isoCode));
  }, [state]);

  useEffect(() => {
    stateData && setState(stateData[0]);
  }, [stateData]);

  useEffect(() => {
    county && setCounty(countyData[0]);
  }, [countyData]);

  const fetchPosition = async () => {
    try {
      const data = await fetchPositionDetails(id);
      setPositionData(data);
      setcontentValue(data.description);
      setIsFetch(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Müşteri bilgileri alınırken bir hata oluştu:", error);
    }
  };

  const handleBannedCompaniesChange = (value) => {
    // Eğer value bir dizi değilse diziye dönüştür
    if (!Array.isArray(value)) {
      value = value.split("\n");
    }
    setBannedCompanies(value);
  };

  const handlePreferredCompaniesChange = (value) => {
    if (!Array.isArray(value)) {
      value = value.split("\n");
    }
    setPreferredCompanies(value);
  };

  const handleIndustryChange = (value) => {
    if (!Array.isArray(value)) {
      value = value.split("\n");
    }
    setIndustry(value);
  };

  const handleAskAi = async () => {
    try {
      const values = form.getFieldsValue();
      setLoadingAi(true);
      const parameter =
        values.jobtitle +
        " " +
        values.experienceperiod +
        " " +
        values.modeofoperation +
        " " +
        values.workingType +
        " " +
        values.skills;
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/ask-ai`,
        {
          parameters: parameter,
        }
      );
      setAiResponse(response.data.message);
      setcontentValue(response.data.message);
      Notification("success", t("edit_position.job_description_success"));
    } catch (error) {
      Notification("error", t("edit_position.job_description_error"));
      console.error("Form gönderilirken bir hata oluştu:", error);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString);
  };

  const handleCityChange = (value) => {
    const selectedCityInfo = stateData.find((city) => city.isoCode === value);
    setState(selectedCityInfo);
  };

  const handleCountyChange = (value) => {
    const selectedCountyInfo = countyData.find(
      (county) => county.name === value
    );
    setCounty(selectedCountyInfo);
  };

  const fetchPositionDetails = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/api/positions/${id}`);
      const position = response.data;
      const formattedDate = dayjs(position.dateOfStart, dateFormat);
      setSelectedDate(formattedDate);
      setIsoCode(position.positionCountry);

      return response.data;
    } catch (error) {
      console.error("Pozisyonlar getirilirken bir hata oluştu:", error);
      return null;
    }
  };

  const fetchParameters = async () => {
    await axios
      .get(`${apiUrl}/api/parameters`)
      .then((response) => {
        setParameters(response.data);
      })
      .catch((error) => {
        console.error("Roles fetching failed:", error);
      });
  };

  const handleSubmit = async (values) => {
    setSubmitLoading(true);
    try {
      const response = await axios.put(`${apiUrl}/api/positions/${id}`, {
        department: values.department,
        jobtitle: values.jobtitle,
        experienceperiod: values.experienceperiod,
        modeofoperation: values.modeofoperation,
        skills: values.skills,
        description: values.description,
        worktype: values.worktingType,
        industry: values.industry,
        positionCity: state ? state.name : values.positionCity,
        positionCounty: county ? county.name : values.positionCounty,
        positionCountry: isoCode,
        positionAdress: values.positionAdress,
        bannedCompanies: values.bannedcompanies,
        preferredCompanies: values.preferredcompanies,
        dateOfStart: selectedDate ? selectedDate : values.dateOfStart,
      });
      Notification(
        "success",
        t("edit_position.update_success1"),
        t("edit_position.update_success2")
      );

      setTimeout(() => {
        if (user.role === "admin") {
          setSubmitLoading(false);
          navigate("/adminhome");
        } else {
          setSubmitLoading(false);
          navigate("/home");
        }
      }, 500);
    } catch (error) {
      console.error("Form gönderilirken bir hata oluştu:", error);
      Notification(
        "error",
        t("edit_position.update_error1"),
        t("edit_position.update_error2")
      );
      setLoading(false);
      setSubmitLoading(false);
    }
  };
  const infoSector = () => {
    setVisible(true);
  };
  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };
  return (
    <>
      {user?.role === "admin" && <NavBar />}
      {user?.role === "user" && <UserNavbar />}
      {loading ? (
        <Loading />
      ) : (
        <div className="body">
          <div className="w-full">
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={() => {
                if (user?.role === "admin") {
                  navigate("/adminhome");
                  dispatch(setSelectedOption("list-positions"));
                } else {
                  navigate("/home");
                  dispatch(setUserSelectedOption("position"));
                }
              }}
            >
              {t("edit_position.back")}
            </Button>
            <h2 className="text-center text-2xl">
              {t("edit_position.edit_position")}
            </h2>

            {positionData && (
              <Form
                form={form}
                initialValues={positionData}
                onFinish={handleSubmit}
                layout="vertical"
                className="bg-white grid grid-cols-1 sm:grid-cols-2 gap-4 shadow-md rounded px-8 pt-6 pb-8 mt-4"
              >
                <Form.Item
                  label={t("edit_position.job_title")}
                  name="jobtitle"
                  rules={[
                    {
                      required: true,
                      message: t("edit_position.enter_job_title"),
                    },
                  ]}
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder={t("edit_position.select_job_title")}
                  >
                    {parameters.map((parameter, index) => {
                      if (parameter.title === "İş Unvanı") {
                        return parameter.values.map((value, idx) => (
                          <Option key={`${parameter._id}-${idx}`} value={value}>
                            {value}
                          </Option>
                        ));
                      }
                      return null;
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  label={t("edit_position.department")}
                  name="department"
                  rules={[
                    {
                      required: true,
                      message: t("edit_position.enter_department"),
                    },
                  ]}
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder={t("edit_position.select_department")}
                  >
                    {parameters.map((parameter, index) => {
                      if (parameter.title === "Departman") {
                        return parameter.values.map((value, idx) => (
                          <Option key={`${parameter._id}-${idx}`} value={value}>
                            {value}
                          </Option>
                        ));
                      }
                      return null;
                    })}
                  </Select>
                </Form.Item>

                <Form.Item
                  label={t("edit_position.experience_period")}
                  name="experienceperiod"
                  rules={[
                    {
                      required: true,
                      message: t("edit_position.enter_experience_period"),
                    },
                  ]}
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder={t("edit_position.select_experience_period")}
                  >
                    {parameters.map((parameter, index) => {
                      if (parameter.title === "Deneyim Süresi") {
                        return parameter.values.map((value, idx) => (
                          <Option key={`${parameter._id}-${idx}`} value={value}>
                            {value}
                          </Option>
                        ));
                      }
                      return null;
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  label={t("edit_position.mode_of_operation")}
                  name="modeofoperation"
                  rules={[
                    {
                      required: true,
                      message: "edit_position.enter_mode_of_operation",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder={t("edit_position.select_mode_of_operation")}
                  >
                    {parameters.map((parameter, index) => {
                      if (parameter.title === "Çalışma Şekli") {
                        return parameter.values.map((value, idx) => (
                          <Option key={`${parameter._id}-${idx}`} value={value}>
                            {value}
                          </Option>
                        ));
                      }
                      return null;
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  label={t("edit_position.work_type")}
                  name="worktype"
                  rules={[
                    {
                      required: true,
                      message: t("edit_position.enter_work_type"),
                    },
                  ]}
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder={t("edit_position.select_work_type")}
                  >
                    {parameters.map((parameter, index) => {
                      if (parameter.title === "Sözleşme Tipi") {
                        return parameter.values.map((value, idx) => (
                          <Option key={`${parameter._id}-${idx}`} value={value}>
                            {value}
                          </Option>
                        ));
                      }
                      return null;
                    })}
                  </Select>
                </Form.Item>

                <Form.Item
                  label={
                    <span>
                      {t("edit_position.preferred_industries")}{" "}
                      <InfoCircleOutlined
                        className="text-blue-500"
                        onClick={infoSector}
                      />
                    </span>
                  }
                  name="industry"
                >
                  <Select
                    mode="tags"
                    showSearch
                    optionFilterProp="children"
                    placeholder={t("edit_position.select_industries")}
                    onChange={handleIndustryChange}
                    defaultValue={positionData.industry}
                  >
                    {parameters.map((parameter, index) => {
                      if (parameter.title === "Sektör") {
                        return parameter.values.map((value, idx) => (
                          <Option key={`${parameter._id}-${idx}`} value={value}>
                            {value}
                          </Option>
                        ));
                      }
                      return null;
                    })}
                  </Select>
                </Form.Item>
                <Modal
                  title={t("edit_position.preferred_industries")}
                  visible={visible}
                  onOk={handleOk}
                  onCancel={handleCancel}
                  cancelText="Kapat"
                  okText="Tamam"
                  okButtonProps={{ className: "bg-blue-500" }}
                  cancelButtonProps={{ className: "hidden" }}
                >
                  <p>{t("edit_position.industry_description_1")} </p>
                  <p>{t("edit_position.industry_description_2")} </p>
                </Modal>

                <Form.Item
                  label={t("edit_position.technical_skills")}
                  name="skills"
                  rules={[
                    {
                      required: true,
                      message: t("edit_position.enter_technical_skills"),
                    },
                  ]}
                >
                  <Select
                    mode="tags"
                    showSearch
                    optionFilterProp="children"
                    placeholder={t("edit_position.select_technical_skills")}
                  >
                    {parameters.map((parameter, index) => {
                      if (parameter.title === "Yetenekler") {
                        return parameter.values.map((value, idx) => (
                          <Option key={`${parameter._id}-${idx}`} value={value}>
                            {value}
                          </Option>
                        ));
                      }
                      return null;
                    })}
                  </Select>
                </Form.Item>

                {positionData.bannedCompanies && (
                  <Form.Item
                    label={t("edit_position.banned_companies")}
                    name="bannedcompanies"
                  >
                    <Select
                      mode="tags"
                      showSearch
                      optionFilterProp="children"
                      placeholder={t("edit_position.add_banned_companies")}
                      onChange={handleBannedCompaniesChange}
                      defaultValue={positionData.bannedCompanies}
                    >
                      {positionData.bannedCompanies.map((company, index) => (
                        <Option key={index} value={company}>
                          {company}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}

                <Form.Item
                  label={t("edit_position.preferred_companies")}
                  name="preferredcompanies"
                >
                  <Select
                    mode="tags"
                    showSearch
                    optionFilterProp="children"
                    placeholder={t("edit_position.add_preferred_companies")}
                    onChange={handlePreferredCompaniesChange}
                    defaultValue={positionData.preferredCompanies}
                  >
                    {parameters.map((parameter, index) => {
                      if (parameter.title === "Şirketler") {
                        return parameter.values.map((value, idx) => (
                          <Option key={`${parameter._id}-${idx}`} value={value}>
                            {value}
                          </Option>
                        ));
                      }
                      return null;
                    })}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="date"
                  label={t("edit_position.start_date")}
                  className=""
                >
                  <DatePicker
                    className="w-full"
                    onChange={handleDateChange}
                    placeholder={t("edit_position.enter_start_date")}
                    defaultValue={selectedDate}
                    format={dateFormat}
                    minDate={dayjs(today, dateFormat)}
                  />
                </Form.Item>
                <Form.Item
                  label={t("edit_position.city")}
                  name="positionCity"
                  rules={[
                    { required: true, message: t("edit_position.enter_city") },
                  ]}
                >
                  <Select
                    showSearch
                    style={{ width: "100%" }}
                    value={state ? state.isoCode : undefined}
                    placeholder={t("edit_position.enter_city")}
                    optionFilterProp="children"
                    onChange={(value) => {
                      handleCityChange(value);
                    }}
                    filterOption={(input, option) => {
                      if (isoCode === "TR") {
                        const normalizedInput = input
                          .toString()
                          .replace(/[İIı]/g, (match, offset) =>
                            offset === 0 ? "i" : "i"
                          )
                          .toLowerCase();
                        const normalizedOption = option.children
                          .toString()
                          .replace(/[İIı]/g, (match, offset) =>
                            offset === 0 ? "i" : "i"
                          )
                          .toLowerCase();
                        return normalizedOption.includes(normalizedInput);
                      } else {
                        return (
                          option.children
                            .toString()
                            .toLowerCase()
                            .indexOf(input.toString().toLowerCase()) >= 0
                        );
                      }
                    }}
                  >
                    {stateData &&
                      stateData.map((state, index) => (
                        <Option key={index} value={state.isoCode}>
                          {state.name}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label={t("edit_position.county")}
                  name="positionCounty"
                  rules={[
                    {
                      required: true,
                      message: t("edit_position.enter_county"),
                    },
                  ]}
                >
                  <Select
                    showSearch
                    style={{ width: "100%" }}
                    value={county ? county.name : undefined}
                    placeholder={t("edit_position.enter_county")}
                    optionFilterProp="children"
                    onChange={(value) => {
                      handleCountyChange(value);
                    }}
                    filterOption={(input, option) => {
                      if (isoCode === "TR") {
                        const normalizedInput = input
                          .toString()
                          .replace(/[İIı]/g, (match, offset) =>
                            offset === 0 ? "i" : "i"
                          )
                          .toLowerCase();
                        const normalizedOption = option.children
                          .toString()
                          .replace(/[İIı]/g, (match, offset) =>
                            offset === 0 ? "i" : "i"
                          )
                          .toLowerCase();
                        return normalizedOption.includes(normalizedInput);
                      } else {
                        return (
                          option.children
                            .toString()
                            .toLowerCase()
                            .indexOf(input.toString().toLowerCase()) >= 0
                        );
                      }
                    }}
                  >
                    {countyData &&
                      countyData.map((county, index) => (
                        <Option key={index} value={county.name}>
                          {county.name}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label={t("edit_position.address")}
                  name="positionAdress"
                  rules={[
                    {
                      required: true,
                      message: t("edit_position.enter_address"),
                    },
                  ]}
                >
                  <Input.TextArea
                    placeholder={t("edit_position.enter_address")}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </Form.Item>

                <Form.Item
                  label={t("edit_position.job_description")}
                  name="description"
                  value={contentValue}
                  rules={[
                    {
                      required: true,
                      message: t("edit_position.enter_job_description"),
                    },
                  ]}
                  className="col-start-1 col-end-3"
                >
                  <EditableContent
                    key={aiResponse}
                    content={contentValue}
                    setContent={setcontentValue}
                    handleAskAi={handleAskAi}
                    isLoading={loadingAi}
                    t={t}
                  />
                </Form.Item>
                <Form.Item className="col-start-1 col-end-3 text-center">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitLoading}
                    className="w-full bg-blue-500 h-10 hover:bg-blue-700 text-white font-bold  px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    {submitLoading ? <Spin /> : t("edit_position.update")}{" "}
                  </Button>
                </Form.Item>
              </Form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default EditPosition;
