import React, { useEffect, useState, createContext } from "react";
import {
  Form,
  DatePicker,
  Button,
  Select,
  Input,
  Modal,
  Space,
  Alert,
  Popover,
} from "antd";
import { setUserSelectedOption } from "../redux/userSelectedOptionSlice";
import axios from "axios";
import Notification from "../utils/notification";
import { getIdFromToken } from "../utils/getIdFromToken";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/authSlice";
import { fetchData } from "../utils/fetchData";
import EditableContent from "../components/htmlEditor";
import Loading from "../components/loadingComponent";
import { setSelectedOption } from "../redux/selectedOptionSlice";
import { City, Country, State } from "country-state-city";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "react-country-state-city/dist/react-country-state-city.css";
import { ArrowLeftOutlined, InfoCircleOutlined } from "@ant-design/icons";
import socket from "../config/config";
import { useTranslation } from "react-i18next";

dayjs.extend(customParseFormat);

const dateFormat = "DD-MM-YYYY";
const today = dayjs();
const ReachableContext = createContext(null);
const UnreachableContext = createContext(null);
const { Option } = Select;

const AddPosition = () => {
  const { t, i18n } = useTranslation();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [loadingAi, setLoadingAi] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [parameters, setParameters] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedDate, setSelectedDate] = useState();
  const [stateData, setstateData] = useState();
  const [countyData, setCountyData] = useState();
  const [state, setState] = useState();
  const [county, setCounty] = useState();
  const [country, setCountry] = useState();
  let countryData = Country.getAllCountries();
  const [isoCode, setIsoCode] = useState("");
  const dispatch = useDispatch();
  const [aiResponse, setAiResponse] = useState(" ");
  const [contentValue, setcontentValue] = useState(" ");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [bannedCompanies, setBannedCompanies] = useState(null);
  const [industry, setIndustry] = useState(null);

  const [preferredCompanies, setPreferredCompanies] = useState(null);
  const companyId = getIdFromToken(localStorage.getItem("token"));
  const { user } = useSelector((state) => state.auth);
  const [modal, contextHolder] = Modal.useModal();
  const [industries, setIndustries] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  const selectedOption = useSelector(
    (state) => state.selectedOption.selectedOption
  );
  const userSelectedOption = useSelector(
    (state) => state.userSelectedOption.userSelectedOption
  );
  const findIsoCode = (countryName) => {
    countryData.forEach((item) => {
      if (item.name === countryName) setIsoCode(item.isoCode);
    });
  };

  const handleBannedCompaniesChange = (value) => {
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

  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString);
  };
  const handleCountryChange = (value) => {
    findIsoCode(value);
    const selectedCountry = countryData[value];
    setCountry(selectedCountry);
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
  const navigate = useNavigate();
  const fetchIndustries = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/customers/get-industry/${companyId}`
      );
      setIndustries(response.data.industries);
    } catch (error) {
      console.error("Error fetching industries:", error);
    }
  };
  useEffect(() => {
    if (!user || user.role === null) {
      fetchData()
        .then((data) => {
          dispatch(login(data.user));
          if (data.user.role !== "admin") {
            navigate("/forbidden");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    if (!parameters.length) {
      fetchParameters();
      fetchCompanies();
    }
    form.setFieldsValue({ description: contentValue });
    fetchCompany();
    fetchIndustries();
    fetchCompanies();
    findIsoCode(selectedCompany?.companycountry);
  }, [contentValue, form, isoCode]);

  // useEffect(() => {
  //   form.setFieldsValue({ description: aiResponse });
  // }, [aiResponse, form]);
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

  const fetchParameters = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/api/parameters`)
      .then((response) => {
        setParameters(response.data);
      })
      .catch((error) => {
        console.error("Roles fetching failed:", error);
      });
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
      Notification("success", t("addPosition.jobAI_success"));
    } catch (error) {
      Notification("error", t("addPosition.jobAI_errorr"));
      console.error("Form gönderilirken bir hata oluştu:", error);
    } finally {
      setLoadingAi(false);
    }
  };
  const fetchCompanies = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/api/customers`)
      .then((response) => {
        setCompanies(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Roles fetching failed:", error);
      });
  };
  const fetchCompany = async () => {
    try {
      const companyId = getIdFromToken(localStorage.getItem("token"));
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/customers/${companyId}`
      );
      findIsoCode(response.data.companycountry);
      setSelectedCompany(response.data);
    } catch (error) {
      console.error("Company fetching error:", error);
    }
  };

  const handleSubmit = async (values) => {
    setSubmitLoading(true);
    try {
      if (user.role === "admin") {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/positions`,
          {
            department: values.department,
            jobtitle: values.jobtitle,
            experienceperiod: values.experienceperiod,
            modeofoperation: values.modeofoperation,
            description: values.description,
            worktype: values.workingType,
            positionCountry: isoCode,
            positionCity: state.name,
            positionCounty: county.name,
            skills: values.skills,
            industry: industry,
            bannedCompanies: bannedCompanies,
            preferredCompanies: preferredCompanies,
            positionAdress: values.address,
            dateOfStart: selectedDate,
            companyId: companies[values.companyName]._id,
            companyName: companies[values.companyName].companyname,
          }
        );
        try {
          const response2 = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/notification/add`,
            {
              message:
                "Şirketiniz için  " +
                values.jobtitle +
                " pozisyonunu oluşturdu.",
              type: "nomineeDemand",
              url: `/position-detail/${response.data.positionId}`,
              companyId: "660688a38e88e341516e7acd",
              positionId: response.data.positionId,
              receiverCompanyId: companies[values.companyName]._id,
            }
          );
          socket.emit("positionCreated", response2.data.notificationId);
        } catch (error) {
          console.error(error + "bildirim iletilemedi.");
        }
      } else {
        const companyId = getIdFromToken(localStorage.getItem("token"));

        try {
          const companyNameResponse = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/customers/getname/${companyId}`
          );

          const companyName = companyNameResponse.data.customername;

          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/positions`,
            {
              department: values.department,
              jobtitle: values.jobtitle,
              experienceperiod: values.experienceperiod,
              modeofoperation: values.modeofoperation,
              description: values.description,
              worktype: values.workingType,
              skills: values.skills,
              positionCountry: isoCode,
              positionCity: state.name,
              positionCounty: county.name,
              industry: industry,
              positionAdress: values.address,
              preferredCompanies: preferredCompanies,
              bannedCompanies: bannedCompanies,

              dateOfStart: selectedDate,
              companyId: companyId,
              companyName: companyName,
            }
          );
          const newIndustries = industry.filter(
            (ind) => !industries.includes(ind)
          );

          await Promise.all(
            newIndustries.map(async (newIndustry) => {
              await axios.put(
                `${apiUrl}/api/customers/add-industry/${companyId}`,
                { industry: newIndustry }
              );
            })
          );

          const newCompanies = selectedCompany?.companies.filter(
            (cmp) => !companies.includes(cmp)
          );

          await Promise.all(
            newCompanies.map(async (newCompany) => {
              await axios.put(
                `${apiUrl}/api/customers/add-company/${companyId}`,
                { companies: newCompany }
              );
            })
          );
          try {
            const response2 = await axios.post(
              `${process.env.REACT_APP_API_URL}/api/notification/add`,
              {
                message:
                  companyName +
                  " için " +
                  values.jobtitle +
                  " pozisyon oluşturuldu.",
                type: "nomineeDemand",
                url: `/admin-position-detail/${response.data.positionId}`,
                companyId: companyId,
                positionId: response.data.positionId,
                receiverCompanyId: "660688a38e88e341516e7acd",
              }
            );
            socket.emit("positionCreated", response2.data.notificationId);
          } catch (error) {
            console.error(error + "bildirim iletilemedi.");
          }
        } catch (error) {
          console.error("name fetching error:", error);
        }
      }

      Notification("success", t("addPosition.position_add_success"));
      setTimeout(() => {
        if (user.role === "admin") {
          setSubmitLoading(false);
          dispatch(setSelectedOption("list-positions"));
        } else {
          setSubmitLoading(false);
          dispatch(setUserSelectedOption("position"));
        }
      }, 500);
    } catch (error) {
      console.error("Form gönderilirken bir hata oluştu:", error);
      Notification("error", t("addPosition.position_add_error"));
      setSubmitLoading(false);
    }
  };
  const handleCompanyChange = (value) => {
    setSelectedCompany(value);
    findIsoCode(companies[value]?.companycountry);
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="body">
          <div className="w-full">
            <Button
              icon={<ArrowLeftOutlined />}
              type="link"
              onClick={() => {
                if (user.role === "admin") {
                  dispatch(setSelectedOption("list-positions"));
                } else {
                  dispatch(setUserSelectedOption("position"));
                }
              }}
            >
              {t("addPosition.back")}
            </Button>

            <h2 className="text-center text-2xl">
              {t("addPosition.addPosition_form_title")}
            </h2>
            <Form
              form={form}
              onFinish={handleSubmit}
              layout="vertical"
              className="bg-white grid grid-cols-1 sm:grid-cols-2 gap-4 shadow-md rounded px-8 pt-6 pb-8 mt-4"
            >
              {user.role === "admin" && (
                <Form.Item
                  label={t("addPosition.companyName_label")}
                  name="companyName"
                  rules={[
                    {
                      required: true,
                      message: t("addPosition.companyName_message"),
                    },
                  ]}
                >
                  <Select
                    placeholder={t("addPosition.companyName_placeholder")}
                    onChange={(value) => {
                      handleCompanyChange(value);
                      handleCountryChange(value);
                    }}
                  >
                    {companies.map((company, index) => (
                      <Option key={company._id} value={index}>
                        {company.companyname}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
              <Form.Item
                label={t("addPosition.jobTitle_label")}
                name="jobtitle"
                rules={[
                  {
                    required: true,
                    message: t("addPosition.jobTitle_message"),
                  },
                ]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder={t("addPosition.jobTitle_placeholder")}
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
                label={t("addPosition.department_label")}
                name="department"
                rules={[
                  {
                    required: true,
                    message: t("addPosition.department_message"),
                  },
                ]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder={t("addPosition.department_placeholder")}
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
                label={t("addPosition.experiencePeriod_label")}
                name="experienceperiod"
                rules={[
                  {
                    required: true,
                    message: t("addPosition.experiencePeriod_message"),
                  },
                ]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder={t("addPosition.experiencePeriod_placeholder")}
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
                label={t("addPosition.modeOfOperation_label")}
                name="modeofoperation"
                rules={[
                  {
                    required: true,
                    message: t("addPosition.modeOfOperation_message"),
                  },
                ]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder={t("addPosition.modeOfOperation_placeholder")}
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
                label={t("addPosition.workingType_label")}
                name="workingType"
                rules={[
                  {
                    required: true,
                    message: t("addPosition.workingType_message"),
                  },
                ]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder={t("addPosition.workingType_label")}
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
                  <ReachableContext.Provider value="Light">
                    <Space>
                      <span>
                        {t("addPosition.preferred_sectors")}{" "}
                        <Popover
                          content={t("addPosition.preferred_sector_info")}
                          title={t("addPosition.preferred_sectors")}
                          trigger={"click"}
                        >
                          <InfoCircleOutlined className="text-blue-500" />
                        </Popover>
                      </span>
                    </Space>
                    {contextHolder}
                    <UnreachableContext.Provider value="Bamboo" />
                  </ReachableContext.Provider>
                }
                name="industry"
              >
                {user.role === "admin" ? (
                  <Select
                    mode="tags"
                    showSearch
                    optionFilterProp="children"
                    placeholder={t("addPosition.preferred_sectors_placeholder")}
                    onChange={handleIndustryChange}
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
                ) : (
                  <Select
                    mode="tags"
                    showSearch
                    optionFilterProp="children"
                    placeholder="Sektör Seç"
                    onChange={handleIndustryChange}
                  >
                    {industries.map((industry, index) => (
                      <Option key={`${index}`} value={industry}>
                        {industry}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item
                label={t("addPosition.skills_label")}
                name="skills"
                rules={[
                  { required: true, message: t("addPosition.skills_message") },
                ]}
              >
                <Select
                  mode="tags"
                  showSearch
                  optionFilterProp="children"
                  placeholder={t("addPosition.skills_placeholder")}
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
              <Form.Item
                label={
                  <ReachableContext.Provider value="Light">
                    <Space>
                      <span>
                        {t("addPosition.banned_companies")}{" "}
                        <Popover
                          content={t("addPosition.banned_company_info")}
                          trigger={"click"}
                          title={t("addPosition.banned_companies")}
                        >
                          <InfoCircleOutlined className="text-blue-500" />
                        </Popover>
                      </span>
                    </Space>
                    {contextHolder}
                    <UnreachableContext.Provider value="Bamboo" />
                  </ReachableContext.Provider>
                }
                name="bannedcompanies"
              >
                {user.role === "admin" ? (
                  <Select
                    mode="tags"
                    showSearch
                    optionFilterProp="children"
                    placeholder={t("addPosition.banned_companies_placeholder")}
                    onChange={handleBannedCompaniesChange}
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
                ) : (
                  <Select
                    mode="tags"
                    showSearch
                    optionFilterProp="children"
                    placeholder="Yasaklı Şirket Seç"
                    onChange={handleBannedCompaniesChange}
                  >
                    {selectedCompany?.companies.map((company, index) => (
                      <Option key={`${index}`} value={company}>
                        {console.log("COMPANY Vini:" + company)}
                        {company}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>

              <Form.Item
                label={
                  <ReachableContext.Provider value="Light">
                    <Space>
                      <span>
                        {t("addPosition.preferred_companies")}{" "}
                        <Popover
                          content={t("addPosition.preferred_company_info")}
                          trigger={"click"}
                          title={t("addPosition.preferred_companies")}
                        >
                          <InfoCircleOutlined className="text-blue-500" />
                        </Popover>
                      </span>
                    </Space>
                    {contextHolder}
                    <UnreachableContext.Provider value="Bamboo" />
                  </ReachableContext.Provider>
                }
                name="preferredcompanies"
              >
                <Select
                  mode="tags"
                  showSearch
                  optionFilterProp="children"
                  placeholder={t("addPosition.preferred_companies_placeholder")}
                  onChange={handlePreferredCompaniesChange}
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
                label={t("addPosition.startDate_label")}
                className=""
                rules={[
                  {
                    required: true,
                    message: t("addPosition.startDate_message"),
                  },
                ]}
              >
                <DatePicker
                  className="w-full"
                  onChange={handleDateChange}
                  format={dateFormat}
                  placeholder={t("addPosition.startDate_placeholder")}
                  minDate={dayjs(today, dateFormat)}
                />
              </Form.Item>
              <Form.Item
                label={t("addPosition.city_label")}
                name="companycity"
                rules={[
                  { required: true, message: t("addPosition.city_message") },
                ]}
              >
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  value={state ? state.isoCode : undefined}
                  placeholder={t("addPosition.city_placeholder")}
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
                label={t("addPosition.county_label")}
                name="companycounty"
                rules={[
                  { required: true, message: t("addPosition.county_message") },
                ]}
              >
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  value={state ? state.isoCode : undefined}
                  placeholder={t("addPosition.county_placeholder")}
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
                label={t("addPosition.address_label")}
                name="address"
                rules={[
                  { required: true, message: t("addPosition.address_message") },
                ]}
              >
                <Input.TextArea
                  placeholder={t("addPosition.address_placeholder")}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </Form.Item>
              <Form.Item
                label={t("addPosition.description_label")}
                name="description"
                className="col-start-1 col-end-3"
                rules={[
                  {
                    required: true,
                    message: t("addPosition.description_message"),
                  },
                ]}
              >
                <EditableContent
                  t={t}
                  key={aiResponse}
                  content={aiResponse}
                  setContent={setcontentValue}
                  handleAskAi={handleAskAi}
                  isLoading={loadingAi}
                />
              </Form.Item>
              <Form.Item className="col-start-1 col-end-3 text-center">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitLoading}
                  className="w-full bg-blue-500 h-10 hover:bg-blue-700 text-white font-bold  px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {t("addPosition.save_button")}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddPosition;
