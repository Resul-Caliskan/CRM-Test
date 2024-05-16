import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/authSlice';
import { fetchData } from '../utils/fetchData';
import CompanyForm from "../views/addCustomer";
import ListCustomers from "../views/listCustomer";
import ListDemand from "../views/listDemand";
import ListPosition from "../views/listPosition";
import Parameters from "../views/parameters";
import AdminListPosition from "../views/adminListPositions";
import AddPosition from "../views/addPosition";
import Notifications from "../views/notifications";
import NavBar from '../components/adminNavBar';
import DemandForm from './demand';
import UserForm from './addUser';
import Profile from './profile';
import DetailCustomer from './detailCustomer';

const App = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const selectedOption = useSelector(
    (state) => state.selectedOption.selectedOption
  );
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/forbidden');
    }
    if (!user || user.role === null) {
      fetchData().then(data => {
        dispatch(login(data.user));
        if (data.user.role !== 'admin') {
          navigate('/forbidden');
        }
      }).catch(error => {
        console.error(error);
      });
    }

  }, [user]);

  let renderComponent;
  switch (selectedOption) {
    case "profile":
      renderComponent = <Profile  />
      break;
    case "add-customer":
      renderComponent = <CompanyForm />;
      break;
    case "add-demand":
      renderComponent = <DemandForm />;
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
    case "add-position":
      renderComponent = <AddPosition />;
      break;
    case "parameters":
      renderComponent = <Parameters />;
      break;
    case "edit-customer":
      renderComponent = <ListPosition />;
      break;
    case "add-user":
      renderComponent = <UserForm />;
      break;
    case "notifications":
      renderComponent = <Notifications />;
      break;
      case "detail-customer":
        renderComponent = <DetailCustomer />;
        break;
    default:
      renderComponent = <ListCustomers />;
  }
  return (
    <div className='w-screen h-screen  bg-[#F9F9F9]'>
      <NavBar />
      {user && <div> {renderComponent}</div>}
    </div>


  );
};

export default App;
