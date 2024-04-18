import React, { useEffect, useState } from "react";
import { Form, DatePicker, Button, Select, Input } from "antd";
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

import "react-country-state-city/dist/react-country-state-city.css";

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
  const selectedOption = useSelector(
    (state) => state.selectedOption.selectedOption
  );
  const userSelectedOption = useSelector(
    (state) => state.userSelectedOption.userSelectedOption
  );
  const findIsoCode = (countryName) => {
    console.log("AAAAAAAAAAAAAAAA " + countryName);
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
    console.log(date, dateString);
  };
  const handleCountryChange = (value) => {
    const selectedCountry = countryData[value];
    setCountry(selectedCountry);
    console.log(country);
  };
  const handleCityChange = (value) => {
    console.log("seçilen şehir" + value);
    const selectedCityInfo = stateData.find((city) => city.isoCode === value);
    console.log("selected city " + selectedCityInfo);
    setState(selectedCityInfo);
    console.log(selectedCityInfo);
  };

  const handleCountyChange = (value) => {
    console.log(value + " mahalle");
    const selectedCountyInfo = countyData.find(
      (county) => county.name === value
    );
    console.log(selectedCountyInfo);
    setCounty(selectedCountyInfo);
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (!user || user.role === null) {
      console.log("girdi");
      fetchData()
        .then((data) => {
          console.log("cevap:", data);
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
    console.log("isocode" + isoCode);
  }, [isoCode]);
  useEffect(() => {
    setCountyData(City.getCitiesOfState(isoCode, state?.isoCode));
    console.log("isocode" + isoCode, state);
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
        console.log(response);
        console.log("DATAA PARAMETER: " + response.data);
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

      console.log("ai res:" + aiResponse + " mesaj");

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
        console.log(response);
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
      console.log(response);
      findIsoCode(response.data.companycountry);
      setSelectedCompany(response.data);
      console.log("Company Info: ", response.data);
      console.log("SEÇİLEN ŞİRKET " + selectedCompany);
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
            industry:industry,
            bannedCompanies:bannedCompanies,
            preferredCompanies:preferredCompanies,
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
            console.log(response);
            console.log("Company NAme: " + response.data.customername);
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
            industry:industry,
            positionAdress: values.address,
            preferredCompanies:preferredCompanies,
            bannedCompanies:bannedCompanies,
            dateOfStart: selectedDate,
            companyId: companyId,
            companyName: companyName,
          }
        );
      }

      console.log("Form gönderildi:", values);
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
    console.log("XT" + selectedCompany);
    findIsoCode(companies[value]?.companycountry);
    console.log("isim" + companies[value]?.companycountry);
    console.log("isim" + companies[value]?.companyName);
  };

  return (
    <>
     
      {loading ? (
        <Loading />
      ) : (
        <div className="flex justify-center items-center">
          <div className="w-full px-16 mt-4">
            <h2 className="text-center font-semibold  text-2xl mb-6">
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
              className="bg-white grid grid-cols-2 gap-4 shadow-md rounded px-8 pt-6 pb-8 mb-4"
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
                    onChange={(value) => handleCompanyChange(value)}
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
                label="İşyeri Politikası"
                name="modeofoperation"
                rules={[
                  { required: true, message: "İşyeri Politikasını Giriniz!" },
                ]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="İşyeri Politikası Seç"
                >
                  {parameters.map((parameter, index) => {
                    if (parameter.title === "İşyeri Politikası") {
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
                label="İş Türü"
                name="workingType"
                rules={[{ required: true, message: "İş Türünü Giriniz!" }]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="İş Türü Seç"
                >
                  {parameters.map((parameter, index) => {
                    if (parameter.title === "İş Türü") {
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
              label="Tercih Edilen Sektörler"
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
              <Form.Item label="Yasaklı Şirketler" name="bannedcompanies">
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

              <Form.Item label="Tercih Edilen Şirketler" name="preferredcompanies">
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
                  placeholder="İşe başlama tarihini seçiniz."
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
                    console.log("girdik burayada");
                    handleCityChange(value);
                  }}
                  filterOption={(input, option) =>
                    option.children
                      .toString()
                      .toLowerCase()
                      .indexOf(input.toString().toLowerCase()) >= 0
                  }
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
                  value={county ? county.name : undefined}
                  placeholder="İlçe seç"
                  optionFilterProp="children"
                  onChange={(value) => {
                    handleCountyChange(value);
                  }}
                  filterOption={(input, option) =>
                    option.children
                      .toString()
                      .toLowerCase()
                      .indexOf(input.toString().toLowerCase()) >= 0
                  }
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
