import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUserSelectedOption } from "../redux/userSelectedOptionSlice";
import DashBoard from "../views/dashboard";
import CVList from "../views/listCv";
import ListPosition from "../views/listPosition";
import AddPosition from "../views/addPosition";
import "./style.css";
import hrhub from "../assets/hrhub.png";
import avatar from "../assets/avatar.png";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
export default function UserSideBar() {
  const userSelectedOption = useSelector(
    (state) => state.userSelectedOption.userSelectedOption
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  let renderComponent;
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleOptionClick = (option) => {
    dispatch(setUserSelectedOption(option));
    setIsOpen(false);
  };
  switch (userSelectedOption) {
    case "dashboard":
      renderComponent = <DashBoard />;
      break;
    case "addposition":
      renderComponent = <AddPosition />;
      break;
    case "candidates":
      renderComponent = <CVList />;
      break;
    case "position":
      renderComponent = <ListPosition />;
      break;
    default:
      renderComponent = <DashBoard />;
  }
  const handleLogout = () => {
    localStorage.clear();
    return navigate("/");
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
                  Müşteri İlişkileri Yönetimi
                </label>
              </div>
              <div className="rectangleRight"></div>
            </div>
          </div>
          <div className="avatar-container">
            <div className="labels">
              <label className="nameLabel">{user.email}</label>
              <label className="roleLabel">
                {user.role
                  ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                  : ""}
              </label>
            </div>
            <div className="avatar-icon">
              <img src={avatar} onClick={handleLogout} alt="Resim " />
            </div>
          </div>
        </div>
        <ul class="menu">
          <li class="menu-item">
            <a
              href="#"
              onClick={() => handleOptionClick("dashboard")}
              class="menu-link"
            >
              Dashboard
            </a>
          </li>
          <li class="menu-item">
            <a
              href="#"
              class="menu-link"
              onClick={() => handleOptionClick("candidates")}
            >
              Adaylar
            </a>
          </li>
          <li className="menu-item">
            <a
              href="#"
              className="menu-linkIcon"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
              onClick={() => handleOptionClick("position")}
            >
              <label className="menuLabel">Pozisyonlar</label>
              <span className="icon-container"></span>
            </a>
          </li>
        </ul>
      </div>
      <div className="body">{renderComponent}</div>
    </>
  );
}
