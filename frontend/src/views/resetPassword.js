import React, { useState } from "react";
import logo from "../assets/login.png";
import VHlogo from "../assets/vhlogo.png";
import { Button, Form, Input } from "antd";
import { MailOutlined, LoadingOutlined } from "@ant-design/icons";
import { validateForm } from "../utils/formValidation";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState("");

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
        navigate("/sent-password");
      } catch (error) {}
    } catch (error) {
      setLoading(false);
      console.log(errors.response.data.message);
    }
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    const validationResult = validateForm(value);
    setErrors(validationResult);
  };

  return (
    <div className="flex">
      <div className="hidden sm:block  flex-col justify-center items-center h-full bg-gray-100 w-2/5">
        <img src={logo} alt="Resim" className="w-full h-screen" />
      </div>
      <div className="flex  justify-center items-center h-screen bg-white w-3/5">
        <Form className="flex flex-col gap-5 w-full mx-auto max-w-md">
          <div>
            <h1 className="text-4xl font-semibold mb-2">Şifre Yenile</h1>
            <p className="text-base">
              Şifrenizi sıfırlamak için kayıtlı e-posta adresinizi yazın
            </p>
          </div>
          <div className="flex flex-col py-2">
            <label className="mb-1 text-gray-600 text-xs">Mail</label>
            <Form.Item
              hasFeedback
              name="mail"
              rules={[
                {
                  required: true,
                  message: "Lütfen mail adresinizi giriniz.",
                },
                {
                  pattern: /^\S+@\S+\.(com|net|org|edu|gov)$/i,
                  message: "Lütfen geçerli bir mail adresi giriniz.",
                },
              ]}
            >
              <Input
                placeholder="E-posta adresinizi giriniz"
                onChange={handleInputChange}
                disabled={loading}
                prefix={
                  <MailOutlined
                    className={
                      !errors.email && email.length > 0 ? "text-green-500" : ""
                    }
                  />
                }
              />
            </Form.Item>
          </div>
          {email && !errors.email ? (
            <button
              onClick={handleSubmit}
              className="h-9 bg-black text-white hover:bg-gray-700  rounded-lg"
            >
              {" "}
              {loading ? (
                <LoadingOutlined style={{ marginRight: "5px" }} spin />
              ) : (
                "İlerle"
              )}
            </button>
          ) : (
            <Button disabled="true" className="h-9">
              İlerle
            </Button>
          )}
          <a href="/">
            <p className="text-center text-base hover:font-semibold hover:text-gray-700">
              Giriş sayfasına geri dön
            </p>
          </a>
        </Form>
        <div class="fixed bottom-0 right-0 mb-6 mr-4">
          <img src={VHlogo} alt="Resim" class="w-[156px] h-[22px]" />
        </div>
      </div>
    </div>
  );
}
