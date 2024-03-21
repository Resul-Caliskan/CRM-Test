
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import selectedOptionReducer from './selectedOptionSlice'; 
import userSelectedOptionReducer from './userSelectedOptionSlice';


const store = configureStore({
  reducer: {
    auth: authReducer,
    selectedOption: selectedOptionReducer, 
    userSelectedOption:userSelectedOptionReducer,
  },
});

export default store;
