import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserSelectedOption } from '../redux/userSelectedOptionSlice';
import { Button } from 'antd';
export default function Dashboard() {

    useSelector(state => state.userSelectedOption.userSelectedOption);
    const dispatch = useDispatch();
    const handleNewPosition = () => {
        dispatch(setUserSelectedOption('add-position'));
    };
    const handleCVlist = () => {
        dispatch(setUserSelectedOption('candidates'));
    }
    return (
        <div className="body">
            <div className="flex flex-col items-center justify-center h-screen m-auto">

                <Button
                    block
                    onClick={handleNewPosition}
                    className="rounded-md shadow-md"
                  
                >
                    Yeni Pozisyon Ekle
                </Button>
                <Button
                    block
                    onClick={handleCVlist}
                    className="rounded-md shadow-md mt-2"
                    
                >
                    CV Havuzunu Görüntüle
                </Button>

            </div>
        </div>
    );
}
