import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserSelectedOption } from '../redux/userSelectedOptionSlice';
import { Button } from 'antd';
import { useTranslation } from "react-i18next";
export default function Dashboard() {

    useSelector(state => state.userSelectedOption.userSelectedOption);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const handleNewPosition = () => {
        dispatch(setUserSelectedOption('add-position'));
    };
    const handleCVlist = () => {
        dispatch(setUserSelectedOption('candidates'));
        
    }
    return (
        <div className="body">
            <div className="flex flex-col items-center justify-center h-[800px] m-auto">

                <Button
                    block
                    onClick={handleNewPosition}
                    className="rounded-md shadow-md"
                  
                >
                    {t("user_home.add_position")}
                </Button>
                <Button
                    block
                    onClick={handleCVlist}
                    className="rounded-md shadow-md mt-2"
                    
                >
                      {t("user_home.view_pool")}
                </Button>

            </div>
        </div>
    );
}
