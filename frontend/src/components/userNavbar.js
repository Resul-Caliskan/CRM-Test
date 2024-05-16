import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUserSelectedOption } from "../redux/userSelectedOptionSlice";
import "./style.css";
import hrhub from "../assets/hrhub.png";
import { Badge, Button, Drawer } from "antd";
import { BellOutlined, LogoutOutlined } from "@ant-design/icons";
import { getIdFromToken } from "../utils/getIdFromToken";
import axios from "axios";
import io from "socket.io-client";
import socket from "../config/config";
import { IoPersonCircleOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { AiFillLeftCircle } from "react-icons/ai";

export default function UserNavbar() {
  const { t, i18n } = useTranslation();
  const userSelectedOption = useSelector(
    (state) => state.userSelectedOption.userSelectedOption
  );
  const [letter, setLetter] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownState = useRef(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const companyId = getIdFromToken(localStorage.getItem("token"));
  const [notifications, setNotifications] = useState([]);
  const [isNotificationChanged, setIsNotificationChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleDrawer = () => {
    setShowDrawer(!showDrawer);
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/");
    fetchNotifications();
    if (user) firstLetter();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (
        dropdownState.current &&
        !dropdownState.current.contains(event.target)
      ) {
        setShowDrawer(false);
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
      if (deletedNotification.receiverCompanyId === companyId) {
        setNotifications((prev) =>
          prev.filter(
            (notification) => notification._id !== deletedNotification
          )
        );
      }
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

  const handleOptionClick = (option) => {
    navigate("/home");
    dispatch(setUserSelectedOption(option));
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const updateNotifications = async (index) => {
    try {
      // Sunucuya bildirimin durumunu güncellemek için istek yap
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/notification/mark-as-read/${notifications[index]._id}`
      );
      setShowDrawer(false);
    } catch (error) {
      console.error("Bildirimin durumu güncellenirken bir hata oluştu:", error);
    }
    const updatedNotifications = [...notifications];
    updatedNotifications[index].state = true;
    setNotifications(updatedNotifications);

    navigate(updatedNotifications[index].url);
  };
  const handleNotifications = () => {
    navigate("/home");
    dispatch(setUserSelectedOption("notifications"));
    setShowDrawer(false);
  };
  const firstLetter = () => {
    let firstLetterOfName = user ? user.email[0].toUpperCase() : "";
    setLetter(firstLetterOfName);
  };
  const handleLogout = () => {
    dispatch(setUserSelectedOption("dashboard"));
    localStorage.clear();
    return navigate("/");
  };
  const handleProfile = () => {
    navigate("/home");
    dispatch(setUserSelectedOption("profile"));
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
    <>
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
                <label className="flex items-center justify-center h-full labelTab">
                  {t("customer_relationship_management")}
                </label>
              </div>
              <div className="rectangleRight"></div>
            </div>
          </div>
          <div className="avatar-container">
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
              placement="right"
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
              closable={true}
              onClose={toggleDrawer}
              visible={showDrawer}
            >
              <div className="h-full relative">
                <div className="notification-list">
                  {notifications.slice(0, 12).map((notification, index) => (
                    <div
                      key={index}
                      className={`notification-item ${
                        notification.state ? "read" : "unread"
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
            <div className="hidden labels sm:block md:block lg:block xl:block 2xl:block">
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
                  className="w-full rounded-md hover:bg-[#0000000F] flex flex-col items-center">
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
            className={`menu-item ${
              userSelectedOption === "dashboard" ? "selected" : ""
            }`}
          >
            <a
              href="#"
              onClick={() => handleOptionClick("dashboard")}
              className="menu-link"
            >
              {t("homepage")}
            </a>
          </li>
          <li
            className={`menu-item ${
              userSelectedOption === "candidates" ? "selected" : ""
            }`}
          >
            <a
              href="#"
              className="menu-link"
              onClick={() => handleOptionClick("candidates")}
            >
              {t("candidates")}
            </a>
          </li>
          <li
            className={`menu-item ${
              userSelectedOption === "position" ? "selected" : ""
            }`}
          >
            <a
              href="#"
              className="menu-link"
              onClick={() => handleOptionClick("position")}
            >
              {t("positions")}
            </a>
          </li>

          {user?.role === "user-admin" && (
            <li
              className={`menu-item ${
                userSelectedOption === "parameters" ? "selected" : ""
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
          )}
        </ul>
      </div>
    </>
  );
}
