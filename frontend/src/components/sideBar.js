import React, { useEffect, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { MdDashboardCustomize } from "react-icons/md";
import { FaUsersLine } from "react-icons/fa6";
import { BiLogOut } from "react-icons/bi";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import { MdMoveToInbox } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedOption } from "../redux/selectedOptionSlice";
import UserForm from "../views/addUser";
import CompanyForm from "../views/addCustomer";
import ListCustomers from "../views/listCustomer";
import ListDemand from "../views/listDemand";
import ListPosition from "../views/listPosition";
import Parameters from "../views/parameters";
import AdminListPosition from "../views/adminListPositions";
import "./style.css";
import hrhub from "../assets/hrhub.png";
import avatar from "../assets/avatar.png";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";

export default function SideBar() {
  const selectedOption = useSelector(
    (state) => state.selectedOption.selectedOption
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  let renderComponent;
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
  }, [selectedOption]);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleOptionClick = (option) => {
    dispatch(setSelectedOption(option));
  };
  const handleLogout = () => {
    localStorage.clear();
    return navigate("/");
  };
  switch (selectedOption) {
    case "add-customer":
      renderComponent = <CompanyForm />;
      break;
    case "list-demands":
      renderComponent = <ListDemand />;
      break;
    case "list-customers":
      renderComponent = <ListCustomers />;
      break;
    case "list-positions":
      renderComponent = <AdminListPosition />;
      break;
    case "parameters":
      renderComponent = <Parameters />;
      break;
    case "edit-customer":
      renderComponent = <ListPosition />;
      break;
    default:
      renderComponent = <ListCustomers />;
  }

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
                <label className="text-gray-700 flex items-center justify-center h-full text-sm font-weight-800">
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
          <li className="menu-item">
            <a
              href="#"
              className="menu-link"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
              onClick={() => handleOptionClick("list-costumers")}
            >
              <label className="text-14">Müşteri İşlemleri</label>
              <span className="icon-container">
                {isOpen ? (
                  <CaretUpOutlined className="icon" />
                ) : (
                  <CaretDownOutlined className="icon" />
                )}
              </span>
            </a>
            <ul
              className="submenu"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
            >
              <li className="submenu-item">
                <a
                  href="#"
                  onClick={() => handleOptionClick("add-customer")}
                  className="submenu-link"
                >
                  Müşteri Ekle
                </a>
              </li>
              <li className="submenu-item">
                <a
                  href="#"
                  onClick={() => handleOptionClick("list-customers")}
                  className="submenu-link"
                >
                  Müşteri Listele
                </a>
              </li>
            </ul>
          </li>
          <li class="menu-item">
            <a
              href="#"
              class="menu-link"
              onClick={() => handleOptionClick("list-demands")}
            >
              Kullanıcı Talepleri
            </a>
          </li>

          <li class="menu-item hidden-sm">
            <a
              href="#"
              class="menu-link"
              onClick={() => handleOptionClick("list-positions")}
            >
              Pozisyon Talepleri
            </a>
          </li>
          <li class="menu-item hidden-sm">
            <a
              href="#"
              class="menu-link"
              onClick={() => handleOptionClick("parameters")}
            >
              Parametreler
            </a>
          </li>
          <li class="menu-item hidden-sm-dropdown">
            <a href="#" class="menu-link" onClick={toggleDropdown}>
              ...
            </a>
            <ul className={isDropdownOpen ? "submenu2 open" : "submenu2"}>
              <li class="menu-item">
                <a
                  href="#"
                  class="menu-link"
                  onClick={() => handleOptionClick("list-positions")}
                >
                  Pozisyon Talepleri
                </a>
              </li>
              <li class="menu-item">
                <a
                  href="#"
                  class="menu-link"
                  onClick={() => handleOptionClick("parameters")}
                >
                  Parametreler
                </a>
              </li>
              <li class="menu-item">
                <a
                  href="#"
                  class="menu-link"
                  onClick={() => handleOptionClick("list")}
                >
                  List
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div className="body">{renderComponent}</div>
    </>
  );
}
