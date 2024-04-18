import React, { useEffect, useState ,useRef} from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUserSelectedOption } from "../redux/userSelectedOptionSlice";
import "./style.css";
import hrhub from "../assets/hrhub.png";
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
export default function UserNavbar() {
  const userSelectedOption = useSelector(
    (state) => state.userSelectedOption.userSelectedOption
  );
  const [letter, setLetter] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/");
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

  }, [user]);
  const handleOptionClick = (option) => {
    navigate("/home");
    dispatch(setUserSelectedOption(option));
  };
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    return navigate("/");
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
                <label className="flex items-center justify-center h-full labelTab">
                  Müşteri İlişkileri Yönetimi
                </label>
              </div>
              <div className="rectangleRight"></div>
            </div>
          </div>
          <div className="avatar-container">
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
                <li className="logout-button" onClick={handleLogout} >Çıkış  <LogoutOutlined /></li>
              </ul>
            )}

          </div>
        </div>
        <ul class="menu">
          <li className={`menu-item ${userSelectedOption === "dashboard" ? "selected" : ""}`}>
            <a href="#" onClick={() => handleOptionClick("dashboard")} className="menu-link">
              Anasayfa
            </a>
          </li>
          <li className={`menu-item ${userSelectedOption === "candidates" ? "selected" : ""}`}>
            <a href="#" className="menu-link" onClick={() => handleOptionClick("candidates")}>
              Adaylar
            </a>
          </li>
          <li className={`menu-item ${userSelectedOption === "position" ? "selected" : ""}`}>
            <a href="#" className="menu-link" onClick={() => handleOptionClick("position")}>
              Pozisyonlar
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}