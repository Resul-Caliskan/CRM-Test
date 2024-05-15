import React, { useEffect, useState } from "react";
import VHlogo from "../assets/vhlogo.png";
import { Button, ConfigProvider, Form, Input, Space } from "antd";
import {
  MailOutlined,
  LoadingOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { validateForm } from "../utils/formValidation";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Notification from "../utils/notification";
import "../components/Login.css";
import logo from "../assets/login.png";
import logoIcon from "../assets/logoIcon.png";
import logoText from "../assets/logoText.png";
import { IoCloseCircleSharp } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { resetWarned } from "antd/es/_util/warning";

export default function ResetPassword() {
  const navigate = useNavigate();
  
  const { t, i18n } = useTranslation();
  const [errors, setErrors] = useState({});
  const [emailError, setEmailError] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth <= 576) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/user-check-mail`,
        {
          email: email,
        }
      );
      try {
        const response2 = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/sendemail-password`,
          {
            id: response.data.id,
            recipientEmail: email,
          }
        );
        // Reset the form state after successful submission
        setEmail("");
        setErrors({}); // Clear any existing validation errors
        setLoading(false); // Reset loading state
        navigate("/sent-password");
      } catch (error) {
        // Handle error
      }
    } catch (error) {
      Notification(
        "error",
        t("reset_password.user_not_found"),
        t("reset_password.check_mail")
      );
      setLoading(false);
      setEmail("");

      setEmailError(true); // Clear any existing validation errors
    }
  };

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    setEmailError("");
    const { email } = validateForm(value, true);
    setErrors(email);
    setEmailError(email);
  };
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.cookie = `i18next=${lng}; path=/`;
    document.title = "HRHUB | " + t("customer_relationship_management");
  };

  return (
    
    <div className="flex container-div">
      <div className="flex flex-row absolute right-0 mr-3 mt-2 ">
        <button className="mr-4" onClick={() => changeLanguage("en")}>
          English
        </button>
        <button onClick={() => changeLanguage("tr")}>Türkçe</button>
      </div>
    <div className="loginNone">
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100 login-image">
        {isVisible && (
          <div className="loginFirst">
            <div className="loginSecond">
              <img src={logo} alt="Resim" className="h-screen" />
            </div>
          </div>
        )}
      </div>
      <div className="loginLogo">
        <img src={logoIcon} alt="Logo" className="logoIcon" />
        <img src={logoText} alt="Logo" className="logoText" />
      </div>
      </div>
      <div className="flex flex-col justify-center items-center h-screen bg-white form-div mx-auto">
        <Form className="flex flex-col  w-full mx-auto form p-5">
          <div>
            <h1 className="text-4xl font-semibold mb-2">{t("reset_password.reset_password")}</h1>
            <p className="text-base">
            {t("reset_password.mail_password_input")}
            </p>
          </div>
          <div className="flex flex-col py-2">
            <label className="mb-1 text-gray-600 text-xs">{t("reset_password.mail")}</label>
            <Form.Item
              hasFeedback
              name="mail"
              rules={[
                {
                  required: true,
                  message: t("reset_password.enter_mail"),
                },
                {
                  pattern: /^\S+@\S+\.(com|net|org|edu|gov)$/i,
                  message: t("reset_password.enter_valid_mail"),
                },
              ]}
            >
              <ConfigProvider
                theme={{
                  components: {
                    Input: emailError
                      ? {
                          colorPrimary: "#133163",
                          hoverBorderColor: "red",
                          activeBorderColor: "red",
                        }
                      : {
                          colorPrimary: "#133163",
                          hoverBorderColor: "#133163",
                          activeBorderColor: "#133163",
                        },
                  },
                }}
              >
                <Space className={" block"}>
                  <Input
                    value={email}
                    disabled={loading}
                    placeholder= {t("reset_password.mail_placeholder")}
                    rules={[
                      {
                        required: true,
                        message: t("reset_password.mail_rule_message1"),
                        type: "email",
                        message: t("reset_password.mail_rule_message2"),
                      },
                    ]}
                    className={`focus:custom-blue text-sm border pl-3 p-2   ${
                      emailError ? "border-custom-red" : email ? "" : ""
                    } `}
                    onFocus={() => {
                      setEmailError();
                    }}
                    onBlur={(e) => {
                      handleEmailChange(e);
                      setEmail(e.target.value);
                    }}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    prefix={
                      <MailOutlined
                        className={`mr-2 ${
                          emailError
                            ? "text-red-500"
                            : email && emailError === false
                            ? "text-green-500"
                            : "text-gray-500"
                        }`}
                      />
                    }
                    suffix={
                      emailError ? (
                        <div style={{ paddingRight: "8px" }}>
                          <IoCloseCircleSharp
                            className="text-red-500 size-[16px] cursor-pointer ml-2"
                            onClick={() => {
                              setEmail("");
                              setEmailError("");
                            }}
                          />
                        </div>
                      ) : email && emailError === false ? (
                        <div style={{ paddingRight: "8px" }}>
                          <CheckCircleFilled
                            style={{
                              color: "#52c41a",
                              fontSize: 14,
                              marginTop: 2,
                            }}
                          />
                        </div>
                      ) : null
                    }
                  />
                </Space>
              </ConfigProvider>
            </Form.Item>
          </div>

          <Button
          
            onClick={handleSubmit}
            className="bg-[#0057D9] text-white w-full h-[40px] rounded-lg flex items-center justify-center mb-5"
            disabled={(!(email && emailError === false)|| loading)}
          >
            {loading ? (
              <LoadingOutlined style={{ marginRight: "5px" }} spin />
            ) : (
              t("reset_password.move_button")
            )}
          </Button>

          <a href="/">
            <p className="text-center text-base ">{t("reset_password.back_login")}</p>
          </a>
        </Form>
        <div class="fixed bottom-0 right-0 mb-6 mr-4">
          <img src={VHlogo} alt="Resim" class="w-[156px] h-[22px]" />
        </div>
      </div>
    </div>
  );
}
