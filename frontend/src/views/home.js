import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/authSlice";
import { fetchData } from "../utils/fetchData";
import UserNavbar from "../components/userNavbar";
import DashBoard from "../views/dashboard";
import Notifications from "../views/notifications";
import CVList from "../views/listCv";
import ListPosition from "../views/listPosition";
import CustomerParameters from "../views/customerParameters";
import AddPosition from "../views/addPosition";
import { useNavigate } from "react-router-dom";
import Profile from "./profile";

const App = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const userSelectedOption = useSelector(
    (state) => state.userSelectedOption.userSelectedOption
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "admin") navigate("/forbidden");
    if (!user || user.role === null) {
      fetchData()
        .then((data) => {
          dispatch(login(data.user));
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [user]);
  let renderComponent;
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
    case "add-position":
      renderComponent = <AddPosition />;
      break;
    case "notifications":
      renderComponent = <Notifications />;
      break;
    case "parameters":
      renderComponent = <CustomerParameters />;
      break;
    case "profile":
      renderComponent = <Profile />;
      break;
    default:
      renderComponent = <DashBoard />;
  }

  return (
    <div className="w-full h-screen bg-[#F9F9F9]">
      <UserNavbar />
      <div className="">{renderComponent}</div>
    </div>
  );
};
export default App;
