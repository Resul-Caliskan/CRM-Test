import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select } from "antd";

import axios from "axios";

import Notification from "../utils/notification";
import { getIdFromToken } from "../utils/getIdFromToken";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const AddPosition = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [parameters, setParameters] = useState([]);
  const navigate = useNavigate();
  const [aiResponse, setAiResponse] = useState(" ");
  useEffect(() => {
    fetchParameters();
    form.setFieldsValue({ description: aiResponse });
  }, [aiResponse, form]);

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
      const values = form.getFieldsValue(); // Formdaki tüm değerleri al (doğrulama yapmadan)
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

      Notification("success", "Yapay Zeka Mutlu.");
    } catch (error) {
      Notification("error", "Yapay Zeka Üzgün.");
      console.error("Form gönderilirken bir hata oluştu:", error);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
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
    console.log("nameee:" + companyName);
    try {
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

      Notification(
        "success",
        "Pozisyon ekleme Başarılı.",
        "Pozisyo Başarıyla Eklendi"
      );
      setTimeout(() => {
        navigate("/home");
      }, 1000);
      console.log("Form gönderildi:", values);
      setLoading(false);
      form.resetFields();
    } catch (error) {
      Notification(
        "error",
        "Pozisyon eklenemedi.",
        "Pozisyon Eklenirken Bir Hata Oluştu"
      );
      console.error("Form gönderilirken bir hata oluştu:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-lg mt-12">
        <h2 className="text-center text-2xl mb-6">Pozisyon Ekle</h2>
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
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
            rules={[{ required: true, message: "Deneyim Süresini Giriniz!" }]}
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
            rules={[{ required: true, message: "Teknik Becerileri Giriniz!" }]}
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
          <Button
            type="button"
            onClick={handleAskAi}
            loading={loadingAi}
            className="text-white w-full h-10  mb-4  bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm  text-center "
          >
            Yapay Zeka İle İş Tanımı Oluştur
          </Button>
          <Form.Item
            label="İş Tanımı"
            name="description"
            rules={[{ required: true, message: "İş Tanımını Giriniz!" }]}
          >
            <Input.TextArea value={aiResponse} placeholder="İş Tanımı" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold  px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Kaydet
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddPosition;