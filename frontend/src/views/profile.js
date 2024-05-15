import React, { useEffect, useRef, useState } from "react";
import { IoPersonCircleOutline, IoSettingsOutline } from "react-icons/io5";
import { RiLogoutCircleLine,RiUserAddFill  } from "react-icons/ri";

import { useNavigate } from "react-router-dom";
import UserInfo from "../components/profile/userInfo";
import { CaretDownOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import "../components/style.css";
import { useSelector } from "react-redux";
import UserForm from "./addUser";
export default function Profile() {
  const { t, i18n } = useTranslation();
  const [activeItem, setActiveItem] = useState("user");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState();
  const { user } = useSelector((state) => state.auth);
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
      case "userManagement":
        return <UserForm />;
      default:
        return null;
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    return navigate("/");
  };

  return (
    <div class="body">


      <div className="flex flex-col sm:flex-row justify-center overflow-hidden h-full w-full  bg-[#F9F9F9] pt-2 sm:pt-10  font-sans gap-1 sm:gap-4">
        <div className="flex-row border pt-0 sm:pt-5   mb-4  items-center bg-white rounded-lg">
          <ul className="flex flex-row sm:flex-col gap-0 sm:gap-5  p-0 sm:p-5  sm:h-full text-gray-500">
            <li
              onClick={() => setActiveItem("user")}
              className={`${activeItem === "user" && "text-black bg-gray-100  rounded-lg"
                } cursor-pointer w-full px-5 py-2 `}
            >
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <IoPersonCircleOutline size={20} />
                <p className="hidden sm:block">{t("profile.user_info")}</p>
              </div>
            </li>
            {user.role === 'admin' && (
              <li
                onClick={() => setActiveItem("userManagement")}
                className={`${activeItem === "userManagement" && "text-black bg-gray-100  rounded-lg"
                  } cursor-pointer w-full px-5 py-2 `}
              >
                <div
                  className="flex flex-col sm:flex-row  items-center gap-3 cursor-pointer"
                >
                  <RiUserAddFill  size={20} />
                  <p className="hidden sm:block">{t("profile.add_user")}</p>
                </div>
              </li>)}
            <li
              onClick={handleLogout}
              className={`cursor-pointer w-full  px-5 py-2`}
            >
              <div className="flex flex-col sm:flex-row items-center gap-3 ">
                <RiLogoutCircleLine className="text-gray-500" size={20} />
                <p className="hidden sm:block">{t("profile.logout")}</p>
              </div>
            </li>
          </ul>
        </div>
        <div className="flex justify-center border items-start  h-full  mb-4 bg-white rounded-lg sm:w-full w-full md:w-3/6">
          {renderComponent(activeItem)}
        </div>
      </div>
    </div>
  );
}