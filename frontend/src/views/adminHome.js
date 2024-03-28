import React, {useEffect } from 'react';
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
import NavBar from '../components/adminNavBar';
const App = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const selectedOption = useSelector(
    (state) => state.selectedOption.selectedOption
  );
  useEffect(() => {
  
    if (!user || user.role === null) {
      console.log("girdi");
      fetchData().then(data => {
        console.log("cevap:", data);
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
      <NavBar/>
      <div>{renderComponent }</div>
    </>
    

  );
};

export default App;
