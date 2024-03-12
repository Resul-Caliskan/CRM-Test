import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';


export const setAuthToken = token => {
  
  if (token) {
    axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
  }
  else
    delete axios.defaults.headers.common["authorization"];
}
axios.interceptors.response.use(
  response => response,
  error => {
    const originalRequest = error.config;

    if (error.response.status === 401 && localStorage.getItem('refreshToken')) {
      return axios.post(`${process.env.REACT_APP_API_URL}/api/auth/refresh-token`, {
        refreshToken: localStorage.getItem('refreshToken')
      }).then(response => {
        const newToken = response.data.accessToken;
        localStorage.setItem('token', newToken);
        setAuthToken(newToken);
        originalRequest.headers["authorization"] = `Bearer ${newToken}`;
        return axios(originalRequest);
      }).catch(error => {


        
        if (error.response.status === 403) {
         
          localStorage.clear();
          console.log("REFRESH BİTMİŞ");
          

        }
        console.error("Token yenileme hatası:", error);

        return Promise.reject(error);
      });
    }
    return Promise.reject(error);
  }
);