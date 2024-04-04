import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedOption } from "../redux/selectedOptionSlice";
import "./style.css";
import hrhub from "../assets/hrhub.png";

export default function NavBar() {
  const selectedOption = useSelector(
    (state) => state.selectedOption.selectedOption
  );
  const dispatch = useDispatch();
  const [letter,setLetter] = useState("");
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  let renderComponent;
  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/");
    if (user) firstLetter();
  }, [user]);
  const handleOptionClick = (option) => {
    navigate("/adminhome");
    dispatch(setSelectedOption(option));
  };
  const handleLogout = () => {
      dispatch(setSelectedOption("dashboard"));
    localStorage.clear();
    return navigate("/");
  };
  const firstLetter = () => {
    let firstLetterOfName = user ? user.email[0].toUpperCase():'';
    setLetter(firstLetterOfName);
    console.log("asdasd"+firstLetterOfName);
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
          <div className="labels">
              <label className="nameLabel">{user?.email}</label>
              <label className="roleLabel">
                {user?.role
                  ? user?.role.charAt(0).toUpperCase() + user?.role.slice(1)
                  : ""}
              </label>
            </div>
            <div className="avatar-icon" onClick={handleLogout}>
              <p className="letter">{letter}</p>
            </div>
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
          {/* <li className={`menu-item hidden-sm-dropdown ${selectedOption === "list-positions" || selectedOption === "parameters" ? "selected" : ""}`}>
            <a href="#" className="menu-link" onClick={toggleDropdown}>
              ...
            </a>
            <ul className={isDropdownOpen ? "submenu2 open" : "submenu2"}>
              <li className={`menu-item ${selectedOption === "list-positions" ? "selected" : ""}`}>
                <a href="#" className="menu-link" onClick={() => handleOptionClick("list-positions")}>
                  Pozisyon Talepleri
                </a>
              </li>
              <li className={`menu-item ${selectedOption === "parameters" ? "selected" : ""}`}>
                <a href="#" className="menu-link" onClick={() => handleOptionClick("parameters")}>
                  Parametreler
                </a>
              </li>
              <li className={`menu-item ${selectedOption === "list" ? "selected" : ""}`}>
                <a href="#" className="menu-link" onClick={() => handleOptionClick("list")}>
                  List
                </a>
              </li>
            </ul>
          </li> */}
        </ul>
      </div>
      <div className="">{renderComponent}</div>
    </>
  );
}
