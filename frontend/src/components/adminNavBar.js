import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedOption } from "../redux/selectedOptionSlice";
import "./style.css";
import hrhub from "../assets/hrhub.png";
import { Badge, Drawer } from 'antd';
import { BellOutlined, LogoutOutlined } from '@ant-design/icons';
import io from 'socket.io-client';
import axios from "axios";
import { getIdFromToken } from "../utils/getIdFromToken";
import socket from "../config/config";

export default function NavBar() {
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

    socket.on('createdNot', (notification) => {
      if (notification.receiverCompanyId === companyId) {

        setNotifications((prev) => [notification, ...prev]);
      }
    })
    socket.on('deletedNot', (deletedNotification) => {
      console.log("silinen id:" + deletedNotification + "   companysi:" + deletedNotification.receiverCompanyId);
      if (deletedNotification.receiverCompanyId === companyId) {
        console.log("zartzort" + deletedNotification);
        setNotifications((prev) => prev.filter(notification => notification._id !== deletedNotification));
      }
    });
    socket.on('createdPositionNot', (notification) => {
      console.log("ilk not:"+notification);
      if (notification.receiverCompanyId === companyId) {
        console.log("notification:"+notification);
        setNotifications((prev) => [notification, ...prev]);
      }
    })
  }, [])

  const fetchNotifications = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/notification/get-notifications/${companyId}`,

      );
      console.log(response.data.notifications);
      const filteredNotifications = response.data.notifications.filter(notification => !notification.state).reverse();
      setNotifications(filteredNotifications);
    } catch (error) {
      console.error(error + "Bildirimler alınamadı.")
    }
    setLoading(false); // Yükleme tamamlandıktan sonra loading false olarak ayarlayın
  };


  const toggleDrawer = () => {
    setShowDrawer(!showDrawer);
  };
  const updateNotifications = async (index) => {
    try {
      // Sunucuya bildirimin durumunu güncellemek için istek yap
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
    console.log(updatedNotifications[index].url);
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
    localStorage.clear();
    return navigate("/");
  };
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const firstLetter = () => {
    let firstLetterOfName = user ? user.email[0].toUpperCase() : '';
    setLetter(firstLetterOfName);
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
                <label className="text-gray-700 flex items-center justify-center h-full labelTab">
                  Müşteri İlişkileri Yönetimi
                </label>
              </div>
              <div className="rectangleRight"></div>
            </div>
          </div>
          <div className="avatar-container">
            <Badge count={notifications.filter(notification => !notification.state).length} size="small" onClick={toggleDrawer} status="processing">
              <BellOutlined className="text-gray-600 size-6 hover:text-blue-500 cursor-pointer" />
            </Badge>
            <Drawer
              title="Bildirimler"
              placement="right"
              closable={true}
              onClose={toggleDrawer}
              visible={showDrawer}
            >
              <div className="notification-list">
                {notifications.slice(0, 15).map((notification, index) => (
                  <div key={index} className={`notification-item ${notification.state ? 'read' : 'unread'}`}>
                    <p className={notification.state ? "text-gray-500" : ""} onClick={() => updateNotifications(index)}>
                      <Badge status={notification.state ? "default" : "processing"} className="mr-2" style={{ dotSize: 16 }} />
                      {notification.message}
                    </p>
                  </div>
                ))}
              </div>

              <div className="show-more-button " onClick={handleNotifications}>
                Tümünü Görüntüle
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
              <p className="letter">{letter}</p>
            </div>
            {isOpen && (
              <ul className="user-dropdown-menu " ref={dropdownRef}>
                <li className="logout-button" onClick={handleLogout}>Çıkış <LogoutOutlined /></li>
              </ul>
            )}
          </div>
        </div>
        <ul className="menu">
          <li className={`menu-item ${selectedOption === "dashboard" ? "selected" : ""}`}>
            <a href="#" onClick={() => handleOptionClick("dashboard")} className="menu-link ">
              Anasayfa
            </a>
          </li>
          <li className={`menu-item ${selectedOption === "list-costumers" ? "selected" : ""}`}>
            <a href="#" className="menu-link" onClick={() => handleOptionClick("list-costumers")}>
              Müşteri İşlemleri
            </a>
          </li>
          <li className={`menu-item ${selectedOption === "list-demands" ? "selected" : ""}`}>
            <a href="#" className="menu-link" onClick={() => handleOptionClick("list-demands")}>
              Kullanıcı Talepleri
            </a>
          </li>
          <li className={`menu-item hidden-sm ${selectedOption === "list-positions" ? "selected" : ""}`}>
            <a href="#" className="menu-link" onClick={() => handleOptionClick("list-positions")}>
              Pozisyon Talepleri
            </a>
          </li>
          <li className={`menu-item hidden-sm ${selectedOption === "parameters" ? "selected" : ""}`}>
            <a href="#" className="menu-link" onClick={() => handleOptionClick("parameters")}>
              Parametreler
            </a>
          </li>
        </ul>
      </div>
      {renderComponent}
    </>
  );
}