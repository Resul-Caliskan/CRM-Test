import React, { useEffect, useState, createContext } from "react";
import { Form, DatePicker, Button, Select, Input, Modal, Space, Alert, Popover } from "antd";
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
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import "react-country-state-city/dist/react-country-state-city.css";
import { InfoCircleOutlined } from "@ant-design/icons";
dayjs.extend(customParseFormat);
const dateFormat = 'DD-MM-YYYY';
const today = dayjs();
const ReachableContext = createContext(null);
const UnreachableContext = createContext(null);
const preferredSector = (

  <div className="relative z-50 bg-gray-50 p-6 rounded-lg ">
    <p>Bu alana tercih ettiğiniz sektörleri ekleyebilirsiniz.</p>
    <p>Burada belirtilen sektörler, profilinizdeki </p>
    <p>tercihlerinizin bir parçasıdır ve belirli </p>
    <p>özelliklere göre size önerilerde bulunmamıza yardımcı olur.</p>
  </div>
);
const preferredCompany = (
  <div className="relative z-50 bg-gray-100 p-6 rounded-lg ">
    <p>Bu alana tercih ettiğiniz şirketleri ekleyebilirsiniz.</p>
    <p>Burada belirtilen sektörler, </p>
    <p>pozisyon için önerilen adayların geçmişte </p>
    <p>çalıştığı şirketlere göre önerilme işlemi gerçekleştirir.</p>
  </div>
);
const bannedCompany = (
  <div className="relative z-50 bg-gray-100 p-6 rounded-lg ">
    <p>Bu alana yasaklamak istediğiniz şirketleri ekleyebilirsiniz.</p>
    <p>Burada belirtilen şirketler,</p>
    <p>pozisyon için önerilen adayların geçmişte</p>
    <p>çalıştığı şirketlere göre yasaklama işlemi gerçekleştirir.</p>
  </div>
);
const { Option } = Select;

const AddPosition = () => {
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
  const { user } = useSelector((state) => state.auth);
  const [modal, contextHolder] = Modal.useModal();
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
      value = value.split('\n');
    }
    setBannedCompanies(value);
  };

  const handlePreferredCompaniesChange = (value) => {

    if (!Array.isArray(value)) {
      value = value.split('\n');
    }
    setPreferredCompanies(value);
  };

  const handleIndustryChange = (value) => {

    if (!Array.isArray(value)) {
      value = value.split('\n');
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
      Notification("success", "İş Tanımı Başarıyla Oluşturuldu.");
    } catch (error) {
      Notification("error", "İş Tanımı Oluşturulurken Hata Oluştu.");
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
      } else {
        const companyId = getIdFromToken(localStorage.getItem("token"));
        const companyName = await axios
          .get(
            `${process.env.REACT_APP_API_URL}/api/customers/getname/${companyId}`
          )
          .then((response) => {
            return response.data.customername;
          })
          .catch((error) => {
            console.error("name fetching error:", error);
          });
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
      }

      Notification(
        "success",
        "Başarıyla oluşturuldu.",
        "Pozisyon talebiniz başarıyla oluşturuldu."
      );
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
      Notification(
        "error",
        "Bir hata oluştu.",
        "Pozisyon talebiniz oluşturulurken bir hata oluştu."
      );
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
            <h2 className="text-center text-2xl">
              Pozisyon Ekle
            </h2>
            <button
              className="text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-500/30 font-medium rounded-lg text-sm px-3 py-2.5 text-center flex items-center justify-center me-2 mb-2"
              onClick={() => {
                if (user.role === "admin") {
                  dispatch(setSelectedOption("list-positions"));
                } else {
                  dispatch(setUserSelectedOption("position"));
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Geri Dön
            </button>
            <Form
              form={form}
              onFinish={handleSubmit}
              layout="vertical"
              className="bg-white grid grid-cols-1 sm:grid-cols-2 gap-4 shadow-md rounded px-8 pt-6 pb-8 mb-4"
            >
              {user.role === "admin" && (
                <Form.Item
                  label="Şirket Adı"
                  name="companyName"
                  rules={[
                    { required: true, message: "Lütfen şirket adını seçiniz!" },
                  ]}
                >
                  <Select
                    placeholder="Şirket Seç"
                    onChange={(value) => {
                      handleCompanyChange(value)
                      handleCountryChange(value)
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
                label="İş Unvanı"
                name="jobtitle"
                rules={[{ required: true, message: "İş Unvanını Giriniz!" }]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="İş Unvanı Seç"
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
                label="Departman"
                name="department"
                rules={[{ required: true, message: "Departmanı Giriniz!" }]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="Departman Seç"
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
                label="Deneyim Süresi"
                name="experienceperiod"
                rules={[
                  { required: true, message: "Deneyim Süresini Giriniz!" },
                ]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="Deneyim Süresi Seç"
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
                label="Çalışma Şekli"
                name="modeofoperation"
                rules={[
                  { required: true, message: "İşyeri Politikasını Giriniz!" },
                ]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="Çalışma Şekli Seç"
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
                label="Sözleşme Tipi"
                name="workingType"
                rules={[{ required: true, message: "Sözleşme Tipini Giriniz!" }]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="Sözleşme Tipi Seç"
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
                        Tercih Edilen Sektörler <Popover content={preferredSector} title="Tercih Edilen Sektörler" trigger={"click"} >
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
                <Select
                  mode="tags"
                  showSearch
                  optionFilterProp="children"
                  placeholder="Sektör Seç"
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
              </Form.Item>
              <Form.Item
                label="Teknik Beceriler"
                name="skills"
                rules={[
                  { required: true, message: "Teknik Becerileri Giriniz!" },
                ]}
              >
                <Select
                  mode="tags"
                  showSearch
                  optionFilterProp="children"
                  placeholder="Yetenek Seç"
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
                        Yasaklı Şirketler <Popover content={bannedCompany} trigger={"click"} title="Yasaklı Şirketler">
                          <InfoCircleOutlined className="text-blue-500" />
                        </Popover>
                      </span>
                    </Space>
                    {contextHolder}
                    <UnreachableContext.Provider value="Bamboo" />
                  </ReachableContext.Provider>
                }
                name="bannedcompanies">
                <Select
                  mode="tags"
                  showSearch
                  optionFilterProp="children"
                  placeholder="Yasaklı Şirket Seç"
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
              </Form.Item>

              <Form.Item
                label={
                  <ReachableContext.Provider value="Light">
                    <Space>
                      <span>
                        Tercih Edilen Şirketler <Popover content={preferredCompany} trigger={"click"} title="Tercih Edilen Şirketler">
                          <InfoCircleOutlined className="text-blue-500" />
                        </Popover>
                      </span>

                    </Space>
                    {contextHolder}
                    <UnreachableContext.Provider value="Bamboo" />
                  </ReachableContext.Provider>
                }
                name="preferredcompanies">
                <Select
                  mode="tags"
                  showSearch
                  optionFilterProp="children"
                  placeholder="Tercih Edilen Şirket Seç"
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
                label="İşe Başlama Tarihi"
                className=""
                rules={[
                  { required: true, message: "İşe Başlama Tarihini seçiniz!" },
                ]}
              >
                <DatePicker
                  className="w-full"
                  onChange={handleDateChange}
                  format={dateFormat}
                  placeholder="İşe başlama tarihini seçiniz."
                  minDate={dayjs(today, dateFormat)}
                />
              </Form.Item>
              <Form.Item
                label="Şehir"
                name="companycity"
                rules={[{ required: true, message: "Şehir seçiniz!" }]}
              >
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  value={state ? state.isoCode : undefined}
                  placeholder="Şehir seç"
                  optionFilterProp="children"
                  onChange={(value) => {

                    handleCityChange(value);

                  }}
                  filterOption={(input, option) => {

                    if (isoCode === "TR") {

                      const normalizedInput = input
                        .toString()
                        .replace(/[İIı]/g, (match, offset) => offset === 0 ? "i" : "i")
                        .toLowerCase();
                      const normalizedOption = option.children
                        .toString()
                        .replace(/[İIı]/g, (match, offset) => offset === 0 ? "i" : "i")
                        .toLowerCase();
                      return normalizedOption.includes(normalizedInput);
                    }
                    else {
                      return option.children.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0;
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
                label="İlçe"
                name="companycounty"
                rules={[{ required: true, message: "İlçe seçiniz!" }]}
              >
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  value={state ? state.isoCode : undefined}
                  placeholder="İlçe seç"
                  optionFilterProp="children"
                  onChange={(value) => {
                    handleCountyChange(value);
                  }}
                  filterOption={(input, option) => {

                    if (isoCode === "TR") {
                      const normalizedInput = input
                        .toString()
                        .replace(/[İIı]/g, (match, offset) => offset === 0 ? "i" : "i")
                        .toLowerCase();
                      const normalizedOption = option.children
                        .toString()
                        .replace(/[İIı]/g, (match, offset) => offset === 0 ? "i" : "i")
                        .toLowerCase();
                      return normalizedOption.includes(normalizedInput);
                    }
                    else {
                      return option.children.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0;
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
                label="Adres"
                name="address"
                rules={[{ required: true, message: "Adres giriniz!" }]}
              >
                <Input.TextArea
                  placeholder="Adres"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </Form.Item>
              <Form.Item
                label="İş Tanımı"
                name="description"
                className="col-start-1 col-end-3"
                rules={[{ required: true, message: "İş Tanımını Giriniz!" }]}
              >
                <EditableContent
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
                  Kaydet
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
