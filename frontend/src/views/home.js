import React, {  useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/authSlice';
import { fetchData } from '../utils/fetchData';
import UserNavbar from '../components/userNavbar';
import DashBoard from "../views/dashboard";
import CVList from "../views/listCv";
import ListPosition from "../views/listPosition";
import AddPosition from "../views/addPosition";
import { useNavigate } from 'react-router-dom';

const App = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const userSelectedOption = useSelector(
    (state) => state.userSelectedOption.userSelectedOption
  );
  const navigate=useNavigate();


  useEffect(() => {
    if(user?.role === "admin")
      navigate("/forbidden")
    if (!user || user.role === null) {
      console.log("girdi");
      fetchData().then(data => {
        console.log("cevap:", data);
        dispatch(login(data.user));
      }).catch(error => {
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
        renderComponent=<AddPosition/>
        break;
    default:
      renderComponent = <DashBoard />;
  }
 
  
  return (
    <div>
      <UserNavbar/>
      <div>{renderComponent}</div>
    </div>
   
  );
};
export default App;
