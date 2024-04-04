import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select } from "antd";
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

const { Option } = Select;

const AddPosition = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [loadingAi, setLoadingAi] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [parameters, setParameters] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");

  const dispatch = useDispatch();
  const [aiResponse, setAiResponse] = useState(" ");
  const [contentValue, setcontentValue] = useState(" ");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const { user } = useSelector((state) => state.auth);

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
  }, [contentValue, form]);

  // useEffect(() => {
  //   form.setFieldsValue({ description: aiResponse });
  // }, [aiResponse, form]);

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
            skills: values.skills,
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
      }, 1000);
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
