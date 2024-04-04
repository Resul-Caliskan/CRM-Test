import { Button, Form } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import VHlogo from "../assets/vhlogo.png";
import { useNavigate } from "react-router-dom";
import "../components/Login.css";
import { useEffect, useState } from "react";
import logo from "../assets/login.png";
import logoIcon from "../assets/logoIcon.png";
import logoText from "../assets/logoText.png";
export default function SentPassword() {
  const navigate = useNavigate();
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
  const handleRoute = () => {
    return navigate("/");
  };
  return (
    <div className="flex contianer-div">
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
      <div className="flex  justify-center items-center h-screen bg-white form-div p-5 mx-auto">
        <Form className="flex flex-col gap-5 w-full mx-auto form p-5">
          <div>
            <CheckCircleFilled
              style={{ fontSize: 42, marginBottom: 16, color: "#52C41A" }}
            />
            <h1 className="text-2xl font-semibold mb-2">
              Şifreniz Gönderildi!
            </h1>
            <p className="text-base font-light">
              Şifrenizi sıfırlamak için lütfen e-postanızı kontrol edin
            </p>
          </div>
          <Button
            className="h-9 border-1 border-[#133163]  text-[#133163]"
            onClick={() => handleRoute()}
          >
            Giriş sayfasına geri dön
          </Button>
        </Form>
        <div class="fixed bottom-0 right-0 mb-6 mr-4">
          <img src={VHlogo} alt="Resim" class="w-[156px] h-[22px]" />
        </div>
      </div>
    </div>
  );
}
