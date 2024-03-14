import React from "react";
import { useState } from "react";
import axios from "axios";
import { CheckCircleFilled, EyeInvisibleOutlined } from "@ant-design/icons";
import { Button, Checkbox, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { validateForm } from "../utils/formValidation";
import { setAuthToken } from "../utils/setAuthToken";
import { getMe } from "../services/getMe";
import { IoCloseCircleSharp } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import logo from "../assets/login.png";
import { MailOutlined, LockOutlined, EyeOutlined } from "@ant-design/icons";
import { LoadingOutlined } from "@ant-design/icons";
import VHlogo from "../assets/vhlogo.png";
import Notification from "../utils/notification";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState("");
  const [showPassword, setShowPassword] = useState("");
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    setEmailError("");
    const newErrors = validateForm(value, password);
    setErrors(newErrors);
    setEmailError(newErrors.email || "");
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setPassword(value);
    setPasswordError("");
    const newErrors = validateForm(email, value);
    setErrors(newErrors);
    setPasswordError(newErrors.password || "");
  };

  const handleSubmit = async (e) => {
    console.log("aaaapii " + apiUrl);
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1800);
    const errors = validateForm(email, password);

    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/auth/login`,
          {
            email,
            password,
          }
        );
        setLoading(true);
        const token = response.data.accessToken;
        localStorage.setItem("token", token);
        setAuthToken(token);

        const refreshToken = response.data.refreshToken;
        localStorage.setItem("refreshToken", refreshToken);
        setMessage(response.data.accessToken);
        console.log("token " + response.data.accessToken);

        const responseMe = getMe();
        responseMe.then((data) => {
          console.log("cevap:", data);
          dispatch(login(data.user));

          if (data.user.role === "admin") {
            setTimeout(() => {
              setLoading(false);
              navigate("/adminhome");
            }, 1500);
          } else {
            setTimeout(() => {
              setLoading(false);
              navigate("/home");
            }, 1500);
          }
        });
      } catch (error) {
        setPassword("");
        setEmail("");
        Notification(
          "error",
          "Geçersiz Kullanıcı Bilgileri",
          "E-posta veya Şifreniz yanlış Lütfen Tekrar Giriniz"
        );
        console.error(error.response.data.message);
        setErrors({ login: error.response.data.message });
        console.log("girdiiii");
      }
    } else {
      setErrors(errors);
      setEmailError(errors.email);
      setPasswordError(errors.password);
      console.log(errors);
    }
  };

  return (
    <div className="flex ">
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100 w-2/5">
        <img src={logo} alt="Resim" className="w-full h-screen" />
      </div>

      <div className="flex flex-col justify-center items-center h-screen bg-white w-3/5">
        <form onSubmit={handleSubmit} className="max-w-[458px] w-full mx-auto ">
          <p className="text-3xl  text-left font-semibold">
            İnsan Kaynaklarında Dijital Adımınız!
          </p>
          <h4 className="text-sm text-left my-6">
            Başlamak için lütfen giriş yapın
          </h4>
          <div className="flex flex-col py-2">
            <label className="mb-2 text-gray-600 text-sm">Mail</label>
            <Input
              value={email}
              disabled={loading}
              placeholder="Mail adresinizi yazınız"
              rules={[
                {
                  required: true,
                  message: "Email giriniz!",
                  type: "email",
                  message: "Geçerli bir email adresi giriniz!",
                },
              ]}
              className={`focus:custom-blue text-sm border pl-3 p-2 ${
                emailError ? "border-custom-red" : email ? "" : ""
              }`}
              onChange={(e) => {
                handleEmailChange(e);
                setEmail(e.target.value);
              }}
              prefix={
                <MailOutlined
                  className={`mr-2 ${
                    emailError
                      ? "text-red-500"
                      : email
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
                ) : email ? (
                  <div style={{ paddingRight: "8px" }}>
                    <CheckCircleFilled
                      style={{ color: "#52c41a", fontSize: 14, marginTop: 2 }}
                    />
                  </div>
                ) : null
              }
            />

            {emailError && (
              <p className="text-custom-red text-xs font-light mt-1">
                {emailError}
              </p>
            )}
          </div>
          <div className="flex flex-col py-2">
            <div className="relative">
              <label className="text-gray-600 text-sm ">Şifre</label>
              <Input
                value={password}
                placeholder="Şifrenizi yazınız"
                rules={[
                  {
                    required: true,
                    message: "Şifre giriniz!",
                    type: "password",
                    message: "Geçerli bir şifre giriniz!",
                  },
                ]}
                className={`focus:custom-blue text-sm mt-2 border pl-3 p-2 ${
                  passwordError ? "border-custom-red" : password ? "" : ""
                }`}
                disabled={loading}
                onChange={(e) => {
                  handlePasswordChange(e);
                  setPassword(e.target.value);
                }}
                prefix={
                  <LockOutlined
                    className={`mr-2 ${
                      passwordError
                        ? "text-red-500"
                        : password
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  />
                }
                suffix={
                  <div
                    className="flex flex-row items-center justify-center"
                    style={{ paddingRight: "8px" }}
                  >
                    {showPassword ? (
                      <EyeInvisibleOutlined
                        className="mr-2 size-4"
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                      />
                    ) : (
                      <EyeOutlined
                        className="mr-2 size-4"
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                      />
                    )}
                    {passwordError && (
                      <IoCloseCircleSharp
                        className="text-red-500 size-[16px] cursor-pointer ml-2"
                        onClick={() => {
                          setPassword("");
                          setPasswordError("");
                        }}
                      />
                    )}
                    {!passwordError && password && (
                      <CheckCircleFilled className="text-green-500 size-4" />
                    )}
                  </div>
                }
                type={showPassword ? "text" : "password"}
              />
              {passwordError && (
                <p className=" text-custom-red text-xs font-light mt-1">
                  {passwordError}
                </p>
              )}
            </div>
            <div className="flex row justify-between mt-2 mb-2">
              <Checkbox className="text-[#133163] text-sm font-light">
                Beni hatırla
              </Checkbox>
              <a href="/reset-password">
                <p className="text-[#133163] font-light text-sm">
                  Şifremi unuttum
                </p>
              </a>
            </div>
          </div>

          {email && password && !emailError && !passwordError ? (
            <button
              type="submit"
              className="bg-black text-white w-full h-9 hover:bg-gray-700 rounded-lg flex items-center justify-center mt-5"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <LoadingOutlined style={{ marginRight: "5px" }} spin />
              ) : null}
              {loading ? "" : "Giriş Yap"}
            </button>
          ) : (
            <Button disabled={true} className="h-9 w-full mt-5">
              Giriş yap
            </Button>
          )}

          <div className="mt-2">
            <a href="/demand" className="text-left underline text-sm ">
              Kayıt için talep oluşturunuz.
            </a>
            <p className="text-xs  text-center font-thin mt-6">
              Kullanıcı bilgileriniz her zaman güvende!
            </p>
          </div>
        </form>
        <div class="fixed bottom-0 right-0 mb-6 mr-4">
          <img src={VHlogo} alt="Resim" class="w-[156px] h-[22px]" />
        </div>
      </div>
    </div>
  );
}
