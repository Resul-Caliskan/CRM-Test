
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Home from './views/home';
import AdminHome from './views/adminHome';

import PrivateRoute from './utils/privateRoute';
import Forbidden from './views/forbidden';
import CompanyForm from './views/addCustomer';
import EditCustomerForm from './views/editCustomer';
import UserForm from './views/addUser';
import ListDemand from './views/listDemand';
import DemandForm from './views/demand';
import AddPosition from './views/addPosition';
import ListPosition from './views/listPosition';
import ListCustomers from './views/listCustomer';
import PdfViewer from './views/viewCv';
import EditPosition from './views/editPosition';
import PositionDetail from './views/poisitionDetail';
import AdminPositionDetail from './views/adminPositionDetail';
import ResetPassword from './views/resetPassword';
import SetPassword from './views/setPassword';
import SentPassword from './views/sentPassword';
import { Toaster } from 'react-hot-toast';


function App() {
  return (
    <Router>
    <Toaster/>
      <Routes>
        <Route path="/addcustomer" element={<PrivateRoute Component={CompanyForm}  />} />
        <Route path="/edit-customer/:id" element={<PrivateRoute Component={EditCustomerForm} />} />
        <Route path="/adminhome" element={<PrivateRoute Component={AdminHome}  />} />
        <Route path="/adduser" element={<PrivateRoute Component={UserForm}  />} />
        <Route path="/home" element={<PrivateRoute Component={Home} />} />
        <Route path="/" exact element={< Login />} />
        <Route path="/listdemand"  element={<PrivateRoute Component={ListDemand} />} />
        <Route path="/addposition"  element={<PrivateRoute Component={AddPosition} />} />
        <Route path="/listposition"  element={<PrivateRoute Component={ListPosition} />} />
        <Route path="/list-customer"  element={<PrivateRoute Component={ListCustomers} />} />
        <Route path="/edit-position/:id"  element={<PrivateRoute Component={EditPosition} />} />
        <Route path="/viewpdf"  element={<PrivateRoute Component={PdfViewer} />} />
        <Route path='/forbidden' element={<Forbidden />} />;
        <Route path='/demand' element={< DemandForm/>} />;
        <Route path='/reset-password' element={< ResetPassword/>} />;
        <Route path='/sent-password' element={< SentPassword/>} />;
        {/*  id Yi ekeleyeceğiz */}
        <Route path='/set-password' element={< SetPassword/>} />;
        <Route path="/position-detail/:id"  element={<PrivateRoute Component={PositionDetail} />} />
        <Route path="/admin-position-detail/:id"  element={<PrivateRoute Component={AdminPositionDetail} />} />
      </Routes>

    </Router>


  );
}


export default App;





