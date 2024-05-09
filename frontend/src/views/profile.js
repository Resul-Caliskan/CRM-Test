import React, { useEffect, useRef, useState } from "react";
import { IoPersonCircleOutline, IoSettingsOutline } from "react-icons/io5";
import { RiLogoutCircleLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import UserInfo from "../components/profile/userInfo";
import { CaretDownOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import "../components/style.css";
export default function Profile() {
  const { t, i18n } = useTranslation();
  const [activeItem, setActiveItem] = useState("user");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState();

  const langOptionsRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        langOptionsRef.current &&
        !langOptionsRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [langOptionsRef]);

  const renderComponent = (item) => {
    switch (item) {
      case "user":
        return <UserInfo />;
      default:
        return null;
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    return navigate("/");
  };

  return (
    <div className="flex flex-row justify-center  items-center bg-[#F9F9F9]  pt-10 font-sans gap-4 profile">
      <div className="flex flex-col border col-span-1 py-5 pb-5  mb-4 items-center  bg-white rounded-lg h-full  w-1/6">
        <ul className="flex flex-col gap-2 relative h-full text-gray-500">
          <li
            onClick={() => setActiveItem("user")}
            className={`${
              activeItem === "user" && "text-black bg-gray-100  rounded-lg"
            } cursor-pointer w-full px-5 py-2 `}
          >
            <div className="flex flex-row items-center gap-3">
              <IoPersonCircleOutline size={20} />
              <p>{t("profile.user_info")}</p>
            </div>
          </li>
          <li className=" w-full  px-5 py-2 rounded-lg ">
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="flex flex-row items-center gap-3 cursor-pointer"
            >
              <IoSettingsOutline size={20} />
              <p className="mr-10">{t("profile.settings")}</p>
              <button>
                <CaretDownOutlined className="text-end focus:outline-none"></CaretDownOutlined>
              </button>
            </div>
          </li>
          {isOpen && (
            <LangOptions
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              setIsOpen={setIsOpen}
              langOptionsRef={langOptionsRef}
            />
          )}
          <li
            onClick={handleLogout}
            className={`cursor-pointer w-full  px-5 py-2`}
          >
            <div className="flex  flex-row items-center gap-3 ">
              <RiLogoutCircleLine className="text-gray-500" size={20} />
              <p className="text-gray-500">{t("profile.logout")}</p>
            </div>
          </li>
        </ul>
      </div>
      <div className="flex justify-center border items-start col-span-4   h-full mb-4 bg-white rounded-lg  w-3/6">
        {renderComponent(activeItem)}
      </div>
    </div>
  );
}

const LangOptions = ({
  selectedItem,
  setSelectedItem,
  setIsOpen,
  langOptionsRef,
}) => {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.cookie = `i18next=${lng}; path=/`;
  };
  const handleLanguageSelect = (language) => {
    setSelectedItem(language);
    if (language === "Turkish") {
      changeLanguage("tr");
    } else {
      changeLanguage("en");
    }
  };

  return (
    <div
      ref={langOptionsRef}
      className="ml-10 flex flex-col gap-1 items-center justify-center py-1 px-1 z-30 shadow-xl rounded-md bg-white transition-all duration-300"
    >
      <p
        className={`w-full p-2 pl-5 rounded-md cursor-pointer text-sm ${
          selectedItem === "Turkish" ? "bg-gray-200" : ""
        }`}
        onClick={() => handleLanguageSelect("Turkish")}
      >
        Türkçe
      </p>
      <p
        className={`w-full p-2 pl-5 rounded-md cursor-pointer text-sm ${
          selectedItem === "English" ? "bg-gray-200" : ""
        }`}
        onClick={() => handleLanguageSelect("English")}
      >
        English
      </p>
    </div>
  );
};
