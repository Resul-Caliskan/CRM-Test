import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, Spin, DatePicker, Modal } from "antd";
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
import customParseFormat from 'dayjs/plugin/customParseFormat';


import dayjs from "dayjs";
import { InfoCircleOutlined } from "@ant-design/icons";
dayjs.extend(customParseFormat);
const dateFormat = 'DD-MM-YYYY';
const today = dayjs();
const { Option } = Select;

const EditPosition = () => {
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
      Notification("success", "İş Tanımı Başarıyla Oluşturuldu.");
    } catch (error) {
      Notification("error", "İş Tanımı Oluşturulurken Hata Oluştu.");
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
        "Başarıyla güncellendi.",
        "Pozisyon Talebiniz Başarıyla Güncellenmiştir"
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
        "Bir hata oluştu.",
        "Pozisyon Talebiniz Güncellenirken Bir Hata Oluştu."
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
            <h2 className="text-center text-2xl">Pozisyonu Düzenle</h2>
            <button
              className="text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-500/30 font-medium rounded-lg text-sm px-3 py-2.5 text-center flex items-center justify-center me-2 mb-2"
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
            {positionData && (
              <Form
                form={form}
                initialValues={positionData}
                onFinish={handleSubmit}
                layout="vertical"
                className="bg-white grid grid-cols-1 sm:grid-cols-2 gap-4 shadow-md rounded px-8 pt-6 pb-8 mb-4"
              >
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
                    placeholder="İşyeri Politikası Seç"
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
                  name="worktype"
                  rules={[{ required: true, message: "İş Türünü Giriniz!" }]}
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder="İş Türü Seç"
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
                    Tercih Edilen Sektörler <InfoCircleOutlined className="text-blue-500" onClick={infoSector} />
                  </span>
                }
                  name="industry"
                  

                >
                  <Select
                    mode="tags"
                    showSearch
                    optionFilterProp="children"
                    placeholder="Sektör Seç"
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
                title="Tercih Edilen Sektörler"
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
                cancelText="Kapat"
                okText="Tamam"
                okButtonProps={{ className: 'bg-blue-500' }}
                cancelButtonProps={{className: 'hidden'}}
              >
                <p>Bu alana tercih ettiğiniz sektörleri ekleyebilirsiniz.</p>
                <p>Burada belirtilen sektörler, profilinizdeki tercihlerinizin bir parçasıdır ve belirli özelliklere göre size önerilerde bulunmamıza yardımcı olur.</p>
              </Modal>




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
                    placeholder="Departman Seç"
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
                  <Form.Item label="Yasaklı Şirketler" name="bannedcompanies">
                    <Select
                      mode="tags"
                      showSearch
                      optionFilterProp="children"
                      placeholder="Yasaklı Şirket Seç"
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

                <Form.Item label="Tercih Edilen Şirketler" 
                name="preferredcompanies">
                
                  <Select
                    mode="tags"
                    showSearch
                    optionFilterProp="children"
                    placeholder="Tercih Edilen Şirket Seç"
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



                <Form.Item name="date" label="İşe Başlama Tarihi" className="">
                  <DatePicker
                    className="w-full"
                    onChange={handleDateChange}
                    placeholder="İşe başlama tarihini seçiniz"
                    defaultValue={selectedDate}
                    format={dateFormat}
                    minDate={dayjs(today, dateFormat)}
                  />
                </Form.Item>
                <Form.Item
                  label="Şehir"
                  name="positionCity"
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
                  name="positionCounty"
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
                  name="positionAdress"
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
                  value={contentValue}
                  rules={[{ required: true, message: "İş Tanımını Giriniz!" }]}
                  className="col-start-1 col-end-3"
                >
                  <EditableContent
                    key={aiResponse}
                    content={contentValue}
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
                    {submitLoading ? <Spin /> : "Güncelle"}{" "}
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