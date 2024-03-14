import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/authSlice';
import { fetchData } from '../utils/fetchData';
import UserSideBar from '../components/userSideBar';

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
        
      }).catch(error => {
        console.error(error);
      });
    }

    fetchCustomersFromDatabase();
  }, []);

  const fetchCustomersFromDatabase = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers`);
      setCustomers(response.data);
    } catch (error) {
      console.error('Customers fetching failed:', error);
    }
  };
  return (
   <UserSideBar></UserSideBar>
  );
};
export default App;
