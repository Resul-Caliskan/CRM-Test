import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedOption } from "../redux/selectedOptionSlice";
import "./style.css";
import hrhub from "../assets/hrhub.png";
import { Badge, Button, Drawer, notification } from "antd";
import { BellOutlined, LogoutOutlined } from "@ant-design/icons";
import { IoPersonCircleOutline } from "react-icons/io5";
import io from "socket.io-client";
import axios from "axios";
import { getIdFromToken } from "../utils/getIdFromToken";
import socket from "../config/config";
import { useTranslation } from "react-i18next";
import { AiFillLeftCircle } from "react-icons/ai";
import { getLineHeight } from "antd/es/theme/internal";

export default function NavBar() {
  const { t, i18n } = useTranslation();
  const selectedOption = useSelector(
    (state) => state.selectedOption.selectedOption
  );
  const dispatch = useDispatch();
  const [letter, setLetter] = useState("");
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const companyId = getIdFromToken(localStorage.getItem("token"));
  let renderComponent;
  const [notifications, setNotifications] = useState([]);
  const [initialized, setInitialized] = useState(false);
  let language; 
  useEffect(() => {
    if (!initialized) {
      getLanguageCookie();
      setInitialized(true);
    }
  }, [initialized]);

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/");
    fetchNotifications();
    if (user) firstLetter();
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    socket.on("createdNot", (notification) => {
      if (notification.receiverCompanyId === companyId) {
        setNotifications((prev) => [notification, ...prev]);
      }
    });
    socket.on("deletedNot", (deletedNotification) => {
      setNotifications((prev) =>
        prev.filter(
          (notification) => notification._id !== deletedNotification._id
        )
      );
    });
    socket.on("readNot", (notificationId) => {
      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== notificationId)
      );
    });
    socket.on("createdPositionNot", (notification) => {
      if (notification.receiverCompanyId === companyId) {
        setNotifications((prev) => [notification, ...prev]);
      }
    });
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/notification/get-notifications/${companyId}`
      );
      const filteredNotifications = response.data.notifications
        .filter((notification) => !notification.state)
        .reverse();
      setNotifications(filteredNotifications);
    } catch (error) {
      console.error(error + "Bildirimler alınamadı.");
    }
    setLoading(false);
  };

  const toggleDrawer = () => {
    setShowDrawer(!showDrawer);
  };
  const updateNotifications = async (index) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/notification/mark-as-read/${notifications[index]._id}`
      );
    } catch (error) {
      console.error("Bildirimin durumu güncellenirken bir hata oluştu:", error);
    }
    const updatedNotifications = [...notifications];
    updatedNotifications[index].state = true;
    setNotifications(updatedNotifications);
    setShowDrawer(false);
    navigate(updatedNotifications[index].url);
  };
  const handleNotifications = () => {
    navigate("/adminhome");
    dispatch(setSelectedOption("notifications"));
    setShowDrawer(false);
  };
  const handleOptionClick = (option) => {
    navigate("/adminhome");
    dispatch(setSelectedOption(option));
  };
  const handleLogout = () => {
    dispatch(setSelectedOption("dashboard"));
    localStorage.clear();
    return navigate("/");
  };
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.cookie = `i18next=${lng}; path=/`;
  };
  const firstLetter = () => {
    let firstLetterOfName = user ? user.email[0].toUpperCase() : "";
    setLetter(firstLetterOfName);
  };
  const handleProfile = () => {
    navigate("/adminhome");
    dispatch(setSelectedOption("profile"));
    setIsOpen(false);
  };

  const getLanguageCookie = () => {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split("=");

      if (name === "i18next") {
       return value;
      }
    }
  };
  
  return (
    <div className="">
      <div className="header">
        <div className="navbar">
          <div className="logo">
            <img src={hrhub} alt="Resim" className="" />
          </div>
          <div className="majormenu">
            <div className="rectangleContainer">
              <div className="rectangleSubtract"></div>
              <div className="rectangleLeft"></div>
              <div className="rectangleCenter">
                <label className="text-gray-700 flex items-center justify-center h-full labelTab text-sm">
                  {t("customer_relationship_management")}
                </label>
              </div>
              <div className="rectangleRight"></div>
            </div>
          </div>
          <div className="avatar-container ">
            <Badge
              count={
                notifications.filter((notification) => !notification.state)
                  .length
              }
              size="small"
              onClick={toggleDrawer}
              status="processing"
            >
              <BellOutlined className="text-gray-600 w-[40px] h-[30px] hover:text-blue-500 cursor-pointer pl-4  text-[18px]" />
            </Badge>
            <Drawer
              title={
                <div className="w-full">
                  <p className="mr-5">{t("notifications")}</p>
                </div>
              }
              headerStyle={{
                marginTop: "20px",
                borderBottom: "none",
                textAlign: "center",
                fontfamily: "SF Pro Text",
                fontWeight: "500",
                fontSize: "20px",
                lineHeight: "24px",
                marginRight: "50px",
              }}
              closeIcon={
                <AiFillLeftCircle className="w-[40px] h-[40px] text-[#0057D9] hover:text-[#0050D9]" />
              }
              placement="right"
              closable={true}
              onClose={toggleDrawer}
              visible={showDrawer}
            >
              <div className="h-full relative">
                <div className="notification-list">
                  {notifications.slice(0, 12).map((notification, index) => (
                    <div
                      key={index}
                      className={`notification-item ${notification.state ? "read" : "unread"
                        }`}
                    >
                      <p
                        className={notification.state ? "text-gray-500" : ""}
                        onClick={() => updateNotifications(index)}
                      >
                        <Badge
                          status={notification.state ? "default" : "processing"}
                          className="mr-2"
                          style={{ dotSize: 16 }}
                        />
                       {getLanguageCookie() === "en" ? notification.message.en_message : notification.message.tr_message}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex  bottom-1 w-full ">
                  <Button
                    type="primary"
                    onClick={handleNotifications}
                    className="w-full bg-[#0057D9]"
                  >
                    {t("view_all")}
                  </Button>
                </div>
              </div>
            </Drawer>
            <div className="labels">
              <label className="nameLabel">{user?.email}</label>
              <div className="roleLabel">
                {user?.role
                  ? user?.role.charAt(0).toUpperCase() + user?.role.slice(1)
                  : ""}
              </div>
            </div>
            <div className="avatar-icon" onClick={toggleDropdown}>
              <p className="letter">{user?.email.charAt(0).toUpperCase()}</p>
            </div>
            {isOpen && (
              <ul className="user-dropdown-menu flex flex-col py-1 px-2 items-center" ref={dropdownRef}>
                <li
                  className="w-full rounded-md hover:bg-[#0000000F] flex flex-col items-center ">
                  <a href="#" onClick={handleProfile} className="menu-link "> {t("profile_menu")}</a>
                </li>
                <li
                  className="w-full rounded-md hover:bg-[#0000000F] flex flex-col items-center">
                  <a href="#" onClick={handleLogout} className="menu-link "> {t("logout")}</a>
                </li>
              </ul>
            )}
          </div>
        </div>
        <ul className="menu">
          <li
            className={`menu-item ${selectedOption === "dashboard" ? "selected" : ""
              }`}
          >
            <a
              href="#"
              onClick={() => handleOptionClick("dashboard")}
              className="menu-link "
            >
              {t("homepage")}
            </a>
          </li>
          <li
            className={`menu-item ${selectedOption === "list-costumers" ? "selected" : ""
              }`}
          >
            <a
              href="#"
              className="menu-link"
              onClick={() => handleOptionClick("list-costumers")}
            >
              {t("customer_operations")}
            </a>
          </li>
          {/* <li
            className={`menu-item ${selectedOption === "list-demands" ? "selected" : ""
              }`}
          >
            <a
              href="#"
              className="menu-link"
              onClick={() => handleOptionClick("list-demands")}
            >
              {t("user_demands")}
            </a>
          </li> */}
          <li
            className={`menu-item hidden-sm-sm ${selectedOption === "list-positions" ? "selected" : ""
              }`}
          >
            <a
              href="#"
              className="menu-link"
              onClick={() => handleOptionClick("list-positions")}
            >
              {t("position_demands")}
            </a>
          </li>
          <li
            className={`menu-item hidden-sm ${selectedOption === "parameters" ? "selected" : ""
              }`}
          >
            <a
              href="#"
              className="menu-link"
              onClick={() => handleOptionClick("parameters")}
            >
              {t("parameters_menu")}
            </a>
          </li>
          <li className={`menu-item hidden-sm-dropdown ${selectedOption === "parameters" ? "selected" : ""}`}>
            <a href="#" className="menu-link"  >
              ...
            </a>
            <ul className="submenu">
              {/* <li className={`submenu-item ${selectedOption === "list-positions" ? "selected" : ""}`}>
                <a href="#" className="submenu-link" onClick={() => handleOptionClick("list-positions")}>
                  {t("position_demands")}
                </a>
              </li> */}
              <li className={`submenu-item ${selectedOption === "parameters" ? "selected" : ""}`}>
                <a href="#" className="submenu-link" onClick={() => handleOptionClick("parameters")}>
                  {t("parameters_menu")}
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>


        {renderComponent}



    </div>
  );
}
