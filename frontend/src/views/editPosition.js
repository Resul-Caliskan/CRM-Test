import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, Spin } from "antd";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { login } from '../redux/authSlice';
import { fetchData } from '../utils/fetchData';
import { useNavigate, useParams } from "react-router-dom";
import Notification from "../utils/notification";
import UserNavbar from "../components/userNavbar";
import EditableContent from "../components/htmlEditor";
import Loading from "../components/loadingComponent";
import NavBar from "../components/adminNavBar";

const { Option } = Select;

const EditPosition = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [positionData, setPositionData] = useState(null);
  const [parameters, setParameters] = useState([]);
  const [aiResponse, setAiResponse] = useState(" ");
  const [contentValue, setcontentValue] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [isFetch, setIsFetch] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {

    if (!user || user.role === null) {
      console.log("girdi");
      fetchData().then(data => {
        console.log("cevap:", data);
        dispatch(login(data.user));
        if (data.user.role !== 'admin') {
          navigate('/forbidden');

        }
      }).catch(error => {
        console.error(error);
      });
    }
    if (isFetch) {
      fetchPosition();
    }

    form.setFieldsValue({ description: contentValue });
    const values = form.getFieldsValue();
    console.log("descripton" + values.description);
    fetchParameters();
    console.log("veriiii::" + contentValue)
  }, [id, form, contentValue]);
  const fetchPosition = async () => {
    try {

      const data = await fetchPositionDetails(id);
      setPositionData(data);
      setcontentValue(data.description);
      setIsFetch(false);
      setLoading(false);
      console.log("usestatede gelen data:" + data.description);
    } catch (error) {
      setLoading(false);
      console.error("Müşteri bilgileri alınırken bir hata oluştu:", error);
    }
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
      console.log("ai res:" + aiResponse + " mesaj");

      Notification("success", "İş Tanımı Başarıyla Oluşturuldu.");
    } catch (error) {
      Notification("error", "İş Tanımı Oluşturulurken Hata Oluştu.");
      console.error("Form gönderilirken bir hata oluştu:", error);
    } finally {
      setLoadingAi(false);
    }
  };
  const fetchPositionDetails = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/api/positions/${id}`);
      const position = response.data;
      console.log("gelen pozisyon" + position.worktype);
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
        console.log(response);
        console.log("DATAA PARAMETER: " + response.data);
        setParameters(response.data);
      })
      .catch((error) => {
        console.error("Roles fetching failed:", error);
      });
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.put(`${apiUrl}/api/positions/${id}`, {
        department: values.department,
        jobtitle: values.jobtitle,
        experienceperiod: values.experienceperiod,
        modeofoperation: values.modeofoperation,
        skills: values.skills,
        description: values.description,
        worktype: values.worktingType,
      });
      console.log("FORRRRRRM gönderildi:", values.description);
      setLoading(false);
      Notification(
        "success",
        "Başarıyla güncellendi.",
        "Pozisyon Talebiniz Başarıyla Güncellenmiştir"
      );

      setTimeout(() => {
        if (user.role === "admin") navigate("/adminhome");
        else navigate("/home");
      }, 2000);
    } catch (error) {
      console.error("Form gönderilirken bir hata oluştu:", error);
      Notification(
        "error",
        "Bir hata oluştu.",
        "Pozisyon Talebiniz Güncellenirken Bir Hata Oluştu."
      );
      setLoading(false);
    }
  };

  return (
    <>
      {user.role === "admin" && (<NavBar />)}
      {user.role !== "admin" && (<UserNavbar />)}
      {loading ? <Loading />
        : (
          <div className="flex justify-center items-center">
            <div className="w-full max-w-[1000px] mt-12">
              <h2 className="text-center text-2xl mb-6">Pozisyonu Düzenle</h2>
              <button
                className="text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-500/30 font-medium rounded-lg text-sm px-3 py-2.5 text-center flex items-center justify-center me-2 mb-2"
                onClick={() => {
                  if (user.role === "admin") {
                    navigate("/adminhome");
                  } else {
                    navigate("/home");
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
                    name="worktype"
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
                        if (parameter.title === "skills") {
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
                  <Form.Item className="col-span-2 w-full flex justify-center items-center">
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      className="px-20 bg-blue-500 hover:bg-blue-700 text-white font-bold  px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      {loading ? <Spin /> : "Güncelle"}{" "}
                    </Button>
                  </Form.Item>
                </Form>
              )}
            </div>
          </div >)
      }
    </>
  );
};

export default EditPosition;