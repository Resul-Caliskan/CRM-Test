import React from "react";
import { useState } from "react";
import { Button, Input, Form, Alert } from "antd";
import { validateForm } from "../utils/formValidation";
import logo from "../assets/login.png";
import VHlogo from "../assets/vhlogo.png";
import { LoadingOutlined } from "@ant-design/icons";
import Notification from "../utils/notification";
import { useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";

export default function SetPassword() {
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState("");
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const decoded = jwt_decode(id);
      if (decoded && decoded.id) {
        setUserId(decoded.id);
      }
    }
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
        `${process.env.REACT_APP_API_URL}/api/user-update-password${userId}`,
        {
          password: password,
        }
      );
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1800);
      Notification(
        "success",
        "Şifreniz başarıyla oluşturuldu!",
        "Kullanıcı bilgileriniz ile giriş yapabilirsiniz"
      );
    } catch (error) {
      setLoading(false);
      Notification(
        "error",
        "Şifreniz oluştulamadı",
        "Şifreniz oluşturulurken bir hata oluştu lütfen tekrar deneyiniz"
      );
    }
  };
  return (
    <div className="flex ">
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100 w-2/5">
        <img src={logo} alt="Resim" className="w-full h-screen" />
      </div>
      <div className="flex flex-col justify-center items-center h-screen bg-white w-3/5">
        <Form onSubmit={handleSubmit} className="max-w-[458px] w-full mx-auto ">
          <p className="text-2xl  text-left font-medium">Şifre Belirle</p>
          <p className="text-sm text-left my-4  font-normal">
            Lütfen şifre kurallarına uygun olarak şifrenizi belirleyiniz.
          </p>
          <div className="flex flex-col">
            <label className="   text-gray-600 text-sm">Şifre</label>
            <Form.Item name="password" rules={[]} hasFeedback>
              <Input.Password onChange={handlePasswordChange} />
            </Form.Item>
          </div>
          <div className="flex flex-col ">
            <div className="relative">
              <label className="text-gray-600 text-sm ">Şifre Tekrar</label>
              <Form.Item
                name="confirm"
                onChange={handleConfirmPasswordChange}
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
                <Input.Password />
              </Form.Item>
              <Alert
                message="Şifre Kuralları"
                description={
                  password.length >= 8 &&
                  /[a-zA-Z]/.test(password) &&
                  /\d/.test(password) ? (
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
