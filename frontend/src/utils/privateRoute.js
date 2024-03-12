import React from 'react';
import { Navigate } from 'react-router-dom';
import Login from '../components/login';



function PrivateRoute({ Component}) {
    
    
        const token = localStorage.getItem('token');
        const isLoggedIn = !!token;
        /*if (Component === Login) {
          if (isLoggedIn) return <Navigate to="/home" replace />;
          console.log("girdi");
          return <Component />;
        }*/
        if (!isLoggedIn){
             return <Navigate to="/" />;
             
            
        }
        else{
            return <Component />;
        }
      
        
      
}



export default PrivateRoute;