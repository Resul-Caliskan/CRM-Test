import { useState, useEffect } from "react";
import { Form, Input, Button, Select, Popover } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PhoneNumberUtil } from "google-libphonenumber";
import { PhoneInput } from "react-international-phone";
import { number } from "prop-types";
import Notification from "../utils/notification";
import { setSelectedOption } from "../redux/selectedOptionSlice";
import { setUserSelectedOption } from "../redux/userSelectedOptionSlice";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { ArrowLeftOutlined, InfoCircleOutlined } from "@ant-design/icons";

const { Option } = Select;
const phoneUtil = PhoneNumberUtil.getInstance();
export const isPhoneValid = (phone) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};

const UserForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [phone, setPhone] = useState("");
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/api/customers`)
      .then((response) => {
        setCompanies(response.data);
      })
      .catch((error) => {
        console.error("Roles fetching failed:", error);
      });
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);
    console.log(values.name);
    console.log(values.surname);
    try {
      const formData = {
        companyName: values.companyName,
        name: values.name,
        surname: values.surname,
        role: user.role === "admin" ? values.role : "user",
        email: values.email,
        phone: phone,
      };

      const companyId = companies[formData.companyName]._id;

      const userResponse = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/customers/add/${companyId}`,
        {
          email: formData.email,
          name:formData.name,
          surname:formData.surname,
          password: "123456",
          role: formData.role,
          phone: formData.phone,
        }
      );
      // Check if the user addition was successful
      if (userResponse.status === 200) {
        // If successful, send an email to the user
        const emailResponse = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/sendemail`,
          {
            recipientEmail: formData.email,
            name: formData.name,
            surname: formData.surname,
          }
        );
        Notification(
          "success",
          "Kullanıcı Başarıyla Eklendi.",
          "Kullanıcıya Mail Gönderildi"
        );
        form.resetFields();
        setLoading(false);
        dispatch(setSelectedOption("list-demands"));
      }
    } catch (error) {
      // Handle errors
      setLoading(false);
      if (error.response && error.response.status === 409) {
        setLoading(false);
        Notification("error", error.response.data.error);
      } else {
        // If other errors occur, log and notify the user
        console.error("İstek yapılırken bir hata oluştu:", error);
        Notification("error", "Kullanıcı eklenirken hata oluştu");
      }
    }
  };

  return (
    
      <div className="w-full b rounded-lg ">
        <h2 className="text-center text-2xl my-5 ">{t("addUser.title")}</h2>
        <div className="w-full flex justify-center items-center rounded-lg  ">
          <div className="w-full">
            <Form
              form={form}
              onFinish={handleFormSubmit}
              layout="vertical"
              className="pb-5 my-1 px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-5"
            >
              <Form.Item
                label={t("addUser.company_name_label")}
                name="companyName"
                className="w-full"
                rules={[
                  {
                    required: true,
                    message: t("addUser.company_name_message"),
                  },
                ]}
              >
                <Select className="h-9" placeholder={t("addUser.company_name_placeholder")}>
                  {companies.map((company, index) => (
                    <Option key={company._id} value={index}>
                      {company.companyname}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

             {user.role==='admin' && <Form.Item
                label={
                  <span>
                    {t("addUser.select_role")}{" "}
                    <Popover
                      content={t("addUser.select_role_popover")}
                      trigger={"click"}
                      title={t("addUser.select_role")}
                    >
                      <InfoCircleOutlined className="text-blue-500" />
                    </Popover>
                  </span>
                }
                name="role"
                rules={[{ required: true, message: t("addUser.role_message") }]}
              >
                <Select className="h-9" placeholder={t("addUser.role_placeholder")}>
                  <Option value="user">{t("addUser.user")}</Option>
                  <Option value="user-admin">{t("addUser.system_user")}</Option>
                </Select>
              </Form.Item>}

              <Form.Item
                label={t("addUser.name")}
                name="name"
                rules={[{ required: true, message: t("addUser.name_message") }]}
              >
                <Input className="h-9" placeholder={t("addUser.name")} />
              </Form.Item>
              <Form.Item
                label={t("addUser.surname")}
                name="surname"
                rules={[
                  { required: true, message: t("addUser.surname_message") },
                ]}
              >
                <Input className="h-9" placeholder={t("addUser.surname")} />
              </Form.Item>
              <Form.Item
                label={t("addUser.email")}
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: t("addUser.email_message"),
                  },
                ]}
              >
                <Input className="h-9" placeholder={t("addUser.email")} />
              </Form.Item>
              <Form.Item
                label={t("addUser.phone")}
                name="phone"
                className="w-full"
                rules={[
                  {
                    required: true,
                    type: number,
                    message: t("addUser.phone_message"),
                    validator: (_, value) => {
                      if (value && !isPhoneValid(value) && value.length > 3) {
                        return Promise.reject(t("addUser.phone_message"));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <PhoneInput
                 style={{ width: '500px important!'  }}
                  className=""
                  defaultCountry="tr"
                  value={phone}
                  onChange={(phone) => setPhone(phone)}
                />
              </Form.Item>
              <Form.Item className="lg:col-span-2">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="border w-full  bg-indigo-600 hover:bg-indigo-500 text-white flex justify-center"
                  style={{ borderRadius: "0.375rem" }}
                  loading={loading}
                >
                  {t("addUser.save_button")}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
  );
};

export default UserForm;
