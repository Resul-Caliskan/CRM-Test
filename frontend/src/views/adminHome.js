import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/authSlice';
import { fetchData } from '../utils/fetchData';
import SideBar from '../components/sideBar';
const App = () => {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
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

    fetchCustomersFromDatabase();
  }, []);

  const fetchCustomersFromDatabase = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers`,);
      setCustomers(response.data);
    } catch (error) {
      console.error('Customers fetching failed:', error);
    }
  };

  const handleAddCustomer = () => {
    navigate('/add-customer');
  };

  const handleEditCustomer = (customerId) => {
    navigate(`/edit-customer`, { state: { customerId } });
  };

  return (
    <SideBar></SideBar>

  );
};

export default App;
