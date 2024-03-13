import React, { useEffect, useState } from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { MdDashboardCustomize } from 'react-icons/md';
import { FaUsersLine } from 'react-icons/fa6';
import { BiLogOut } from 'react-icons/bi';
import { VscGitPullRequestGoToChanges } from 'react-icons/vsc';
import { MdMoveToInbox } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; 
import { setSelectedOption } from '../redux/selectedOptionSlice';
import UserForm from '../views/addUser';
import CompanyForm from '../views/addCustomer';
import ListCustomers from '../views/listCustomer';
import ListDemand from '../views/listDemand';
import ListPosition from '../views/listPosition';
import Parameters from '../views/parameters';
import AdminListPosition from '../views/adminListPositions';

export default function SideBar() {
    const selectedOption = useSelector(state => state.selectedOption.selectedOption); 
    const dispatch = useDispatch(); 

    const handleOptionClick = (option) => {
        dispatch(setSelectedOption(option));
    };

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/');
        }
    }, [selectedOption]);

    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const LogOut = () => {
        localStorage.clear();
        return navigate('/');
    };

    let renderComponent;

    switch (selectedOption) {
        case 'add-customer':
            renderComponent = <CompanyForm />;
            break;
        case 'list-demands':
            renderComponent = <ListDemand />;
            break;
        case 'list-customers':
            renderComponent = <ListCustomers />;
            break;
        case 'list-positions':
            renderComponent = <AdminListPosition />;
            break;
        case 'parameters':
            renderComponent = <Parameters />;
            break;
        case 'edit-customer':
            renderComponent = <ListPosition />;
            break;
        default:
            renderComponent = <ListCustomers />;
    }

    return (
        <div className="relative">
            <div className="flex">
                <aside
                    id="sidebar-multi-level-sidebar"
                    className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
                    aria-label="Sidebar"
                >
                    <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                        <ul className="space-y-2 font-medium">
                            <li>
                                <a
                                    href="#"
                                    className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${selectedOption === '' ? 'bg-gray-300' : ''}`}
                                >
                                    <span>
                                        <MdDashboardCustomize className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                    </span>
                                    <span className="ms-3">Dashboard</span>
                                </a>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                    aria-controls="dropdown-example"
                                    data-collapse-toggle="dropdown-example"
                                >
                                    <span>
                                        <FaUsersLine className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                    </span>
                                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                                        Müşteri İşlemleri
                                    </span>
                                    <span>
                                        <RiArrowDropDownLine className="flex-shrink-0 w-5 h-5  text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                    </span>
                                </button>
                                <ul
                                    id="dropdown-example"
                                    className={`py-2 space-y-2 ${
                                        isOpen ? '' : 'hidden'
                                    }`}
                                >
                                    <li>
                                        <a
                                            href="#"
                                            onClick={() =>
                                                handleOptionClick('list-customers')
                                            }
                                            className={`flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${selectedOption === 'list-customers' ? 'bg-gray-300' : ''}`}
                                        >
                                            Müşteri Listele
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            onClick={() =>
                                                handleOptionClick('add-customer')
                                            }
                                            className={`flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${selectedOption === 'add-customer' ? 'bg-gray-300' : ''}`}
                                        >
                                            Müşteri Ekle
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    onClick={() =>
                                        handleOptionClick('list-demands')
                                    }
                                    className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${selectedOption === 'list-demands' ? 'bg-gray-300' : ''}`}
                                >
                                    <span>
                                        <VscGitPullRequestGoToChanges className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                    </span>
                                    <span className="flex-1 ms-3 whitespace-nowrap">
                                        Kullanıcı Talepleri
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    onClick={() =>
                                        handleOptionClick('list-positions')
                                    }
                                    className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${selectedOption === 'list-positions' ? 'bg-gray-300' : ''}`}
                                >
                                    <span>
                                        <MdMoveToInbox className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                    </span>
                                    <span className="flex-1 ms-3 whitespace-nowrap">
                                        Pozisyon Talepleri
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    onClick={() => handleOptionClick('parameters')}
                                    className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${selectedOption === 'parameters' ? 'bg-gray-300' : ''}`}
                                >
                                    <span>
                                        <MdMoveToInbox className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                    </span>
                                    <span className="flex-1 ms-3 whitespace-nowrap">
                                        Parametreler
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    onClick={LogOut}
                                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                >
                                    <span>
                                        <BiLogOut className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                    </span>
                                    <span className="flex-1 ms-3 whitespace-nowrap">
                                        Log Out
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>
            <div className="ml-64 flex-grow flex justify-center">{renderComponent}</div>
        </div>
    );
}
