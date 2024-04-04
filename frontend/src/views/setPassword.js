import React, { useEffect } from "react";
import { useState } from "react";
import { Button, Input, Form, Alert, ConfigProvider, Space } from "antd";
import { IoCloseCircleSharp } from "react-icons/io5";
import { CheckCircleFilled } from "@ant-design/icons";
import { validateForm } from "../utils/formValidation";
import VHlogo from "../assets/vhlogo.png";
import { LoadingOutlined } from "@ant-design/icons";
import Notification from "../utils/notification";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../components/Login.css";
import logo from "../assets/login.png";
import logoIcon from "../assets/logoIcon.png";
import logoText from "../assets/logoText.png";
export default function SetPassword() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState("");
  const { id } = useParams();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (id) {
      const token = jwtDecode(id);

      console.log("id:" + token.id);
      setUserId(token.id);
    }
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

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setPassword(value);
    setPasswordError("");
    const newErrors = validateForm(email, value);
    setErrors(newErrors);
    setPasswordError(newErrors.password || "");
  };
  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setConfirm(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/user-update-password/${userId}`,
        {
          password: password,
        }
      );
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigate("/");
        Notification(
          "success",
          "Şifreniz başarıyla oluşturuldu!",
          "Kullanıcı bilgileriniz ile giriş yapabilirsiniz"
        );
      }, 1000);
    } catch (error) {
      setLoading(false);
      Notification(
        "error",
        "Şifreniz oluşturulamadı",
        "Şifreniz oluşturulurken bir hata oluştu lütfen tekrar deneyiniz"
      );
    }
  };
  return (
    <div className="flex container-div">
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
      <div className="flex flex-col justify-center items-center h-screen bg-white form-div p-5 mx-auto">
        <Form onSubmit={handleSubmit} className=" w-full mx-auto form ">
          <p className="text-2xl  text-left font-medium">Şifre Belirle</p>
          <p className="text-sm text-left my-4  font-normal">
            Lütfen şifre kurallarına uygun olarak şifrenizi belirleyiniz.
          </p>
          <div className="flex flex-col">
            <label className="text-gray-600 text-sm mb-1">Şifre</label>
            <Form.Item name="password" rules={[password.length >= 8]} hasFeedback={{
              validateStatus: password.length < 8 ? 'error' : '',
              help: password.length < 8 ? 'Şifre en az 8 karakter uzunluğunda olmalıdır.' : ''
            }}>
              <ConfigProvider
                theme={{
                  components: {
                    Input: (password.length < 8 || !(/[a-zA-Z]/.test(password)) ||
                      !(/\d/.test(password))) && password.length > 0
                      ? {
                        colorPrimary: "red",
                        hoverBorderColor: "red",
                        activeBorderColor: "red",
                        activeShadow: "pink",
                        colorBorder: "red"

                      }
                      : {
                        colorPrimary: "#133163",
                        hoverBorderColor: "#133163",
                        activeBorderColor: "#133163",

                      },
                  },
                }}>


                <Space className={"block"}>
                  <Input
                    onBlur={handlePasswordChange}
                    placeholder="Şifrenizi yazınız"
                    disabled={loading}
                    className="h-[40px]"
                    suffix={
                      (password.length < 8 || !(/[a-zA-Z]/.test(password)) ||
                        !(/\d/.test(password))) && password.length > 0
                        ? (<div >
                          <IoCloseCircleSharp
                            className="text-red-500 size-4 "
                          />
                        </div>)
                        : password.length>0&&<CheckCircleFilled className="text-green-500 size-4" />
                    }
                  />
                </Space>
              </ConfigProvider>

            </Form.Item>
          </div>
          <div className="flex flex-col ">
            <div className="relative">
              <label className="text-gray-600 text-sm">Şifre Tekrar</label>
              <Form.Item
                name="confirm"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Girdiğiniz şifreler eşleşmiyor!")
                      );
                    },
                  }),
                ]}
              >
                <ConfigProvider
                  theme={{
                    components: {
                      Input: confirm !== password && confirm.length > 0
                        ? {
                          colorPrimary: "red",
                          hoverBorderColor: "red",
                          activeBorderColor: "red",
                          activeShadow: "pink",
                          colorBorder: "red"
                        }
                        : {
                          colorPrimary: "#133163",
                          hoverBorderColor: "#133163",
                          activeBorderColor: "#133163",
                        },
                    },
                  }}
                >
                  <Space className={"block"}>
                    <Input
                      className="mt-1 h-[40px]"
                      onBlur={handleConfirmPasswordChange}
                      placeholder="Şifrenizi tekrar yazınız"
                      disabled={loading}
                      suffix={
                      (confirm.length < 8 || !(/[a-zA-Z]/.test(confirm)) ||confirm!==password||
                        !(/\d/.test(confirm))) && confirm.length > 0 
                        ? (<div >
                          <IoCloseCircleSharp
                            className="text-red-500 size-4 "
                          />
                        </div>)
                        : confirm.length>0&&<CheckCircleFilled className="text-green-500 size-4" />
                    }
                    />
                  </Space>

                </ConfigProvider>

              </Form.Item>
              <Alert
                message="Şifre Kuralları"
                className={`${password.length >= 8 &&
                  /[a-zA-Z]/.test(password) &&
                  /\d/.test(password) && confirm === password ? "hidden" : ""}  `}
                description={
                  password.length >= 8 &&
                    /[a-zA-Z]/.test(password) &&
                    /\d/.test(password) && confirm !== password ? (
                    <p>Lütfen belirlediğiniz şifreyi tekrar yazınız.</p>
                  ) : (
                    <>
                      {password.length < 8 && (
                        <p>En az 8 karakter olmalıdır.</p>
                      )}
                      {!/[a-zA-Z]/.test(password) && (
                        <p>En az bir harf içermelidir.</p>
                      )}
                      {!/\d/.test(password) && (
                        <p>En az bir rakam içermelidir.</p>
                      )}
                    </>
                  )
                }
                type={
                  password.length >= 8 &&
                    /[a-zA-Z]/.test(password) &&
                    /\d/.test(password)
                    ? "success"
                    : "warning"
                }
                showIcon
              />
            </div>
            <div className="flex row justify-between mt-2 mb-2">
              {password === confirm &&
                password.length >= 8 &&
                /[a-zA-Z]/.test(password) &&
                /\d/.test(password) ? (
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  className="bg-[#0057D9] text-white w-full h-[40px] rounded-lg flex items-center justify-center mb-5"
                  disabled={loading}
                >
                  {loading ? (
                    <LoadingOutlined style={{ marginRight: "5px" }} spin />
                  ) : null}
                  {loading ? "" : "Şifre Belirle"}
                </Button>
              ) : (
                <Button disabled={true} className="h-9 w-full mt-5">
                  Şifre Belirle
                </Button>
              )}
            </div>
            <a href="/" className="text-sm  text-center font-light mt-4">
              Giriş sayfasına geri dön
            </a>
          </div>
        </Form>
        <div class="fixed bottom-0 right-0 mb-6 mr-4">
          <img src={VHlogo} alt="Resim" class="w-[156px] h-[22px]" />
        </div>
      </div>
    </div>
  );
}
