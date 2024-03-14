import React, { useState } from 'react';
import { MdDashboardCustomize } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import { VscGitPullRequestNewChanges } from "react-icons/vsc";
import { CiViewList } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { useSelector, useDispatch } from 'react-redux';
import { setUserSelectedOption } from '../redux/userSelectedOptionSlice';
import DashBoard from '../views/dashboard';
import CVList from '../views/listCv';
import ListPosition from '../views/listPosition';

export default function UserSideBar() {
    const userSelectedOption = useSelector(state => state.userSelectedOption.userSelectedOption);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleOptionClick = (option) => {
        dispatch(setUserSelectedOption(option));
        setIsOpen(false);
    };

    let renderComponent;

    switch (userSelectedOption) {
        case 'dashboard':
            renderComponent = <DashBoard />;
            break;
        case 'candidates':
            renderComponent = <CVList />;
            break;
        case 'position':
            renderComponent = <ListPosition />;
            break;
        default:
            renderComponent = <DashBoard />;
    }

    const LogOut = () => {
        localStorage.clear();
        return navigate("/");
    }

    return (
        <div className="app">
            <div className="side">
                <aside id="sidebar-multi-level-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
                    <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                        <ul className="space-y-2 font-medium">
                            <li>
                                <a href="#" onClick={() => handleOptionClick('dashboard')} className={`flex items-center p-2 rounded-lg group ${userSelectedOption === 'dashboard' ? 'bg-gray-300' : ''}`}>
                                    <span><MdDashboardCustomize className='flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'></MdDashboardCustomize></span>
                                    <span className="ms-3">Dashboard</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" onClick={() => handleOptionClick('candidates')} className={`flex items-center p-2 rounded-lg group ${userSelectedOption === 'candidates' ? 'bg-gray-300' : ''}`}>
                                    <span><VscGitPullRequestNewChanges className='flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' /></span>
                                    <span className="flex-1 ms-3 whitespace-nowrap">Adaylar</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" onClick={() => handleOptionClick('position')} className={`flex items-center p-2 rounded-lg group ${userSelectedOption === 'position' ? 'bg-gray-300' : ''}`}>
                                    <span><CiViewList className='flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' /></span>
                                    <span className="flex-1 ms-3 whitespace-nowrap">Pozisyonlarım</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" onClick={LogOut} className="flex items-center p-2 rounded-lg group">
                                    <span><BiLogOut className='flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' /></span>
                                    <span className="flex-1 ms-3 whitespace-nowrap">Log Out</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>
            <div className="main-content ml-64">
                {renderComponent}
            </div>
        </div>
    );
}
