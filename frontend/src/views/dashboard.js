import React from 'react';

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUserSelectedOption } from '../redux/userSelectedOptionSlice';



export default function Dashboard() {
  
    const navigate = useNavigate();
    useSelector(state => state.userSelectedOption.userSelectedOption);
    const dispatch = useDispatch();
    const handleNewPosition = () => {
       navigate('/addposition');
    };
    const handleCVlist=()=>{
        dispatch(setUserSelectedOption('candidates'));
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
             <button onClick={() => handleNewPosition()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4">
                Yeni Pozisyon Ekle
            </button>
            <button onClick={() => handleCVlist()} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                CV Havuzunu Görüntüle
            </button> 
        </div>
    );
}
