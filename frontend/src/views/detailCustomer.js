import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Select } from 'antd';
import { MailOutlined, EnvironmentOutlined, GlobalOutlined, UserOutlined, PhoneOutlined, ShopOutlined, BankOutlined } from '@ant-design/icons';
import axios from "axios";
import Notification from '../utils/notification';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/authSlice';
import { fetchData } from '../utils/fetchData';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { number } from 'prop-types';
import { City, Country, State } from "country-state-city"
import "react-country-state-city/dist/react-country-state-city.css";
import NavBar from '../components/adminNavBar';
import Loading from '../components/loadingComponent';
import { setSelectedOption } from "../redux/selectedOptionSlice";
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useTranslation } from "react-i18next";
import MarkdownEditor from '@uiw/react-markdown-editor';

const { Option } = Select;
const phoneUtil = PhoneNumberUtil.getInstance();

const isPhoneValid = (phone) => {
    try {
        return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
    } catch (error) {
        return false;
    }
};

const EditCustomerForm = () => {
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [parameters, setParameters] = useState([]);
    const [form] = Form.useForm();
    const [customerData, setCustomerData] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [phone, setPhone] = useState('');
    const [stateData, setstateData] = useState();
    const [countyData, setCountyData] = useState();
    const [state, setState] = useState()
    const [county, setCounty] = useState()
    let countryData = Country.getAllCountries();
    const [country, setCountry] = useState();
    const {t} = useTranslation();

    useSelector((state) => state.selectedOption.selectedOption);

    const handleCountryChange = (value) => {
        const selectedCountry = countryData[value];
        setCountry(selectedCountry);
    };

    const handleCityChange = (value) => {
        const selectedCityInfo = stateData.find(city => city.isoCode === value);
        setState(selectedCityInfo)

    }

    const handleCountyChange = (value) => {
        const selectedCountyInfo = countyData.find(county => county.name === value);
        setCounty(selectedCountyInfo);
    };
    useEffect(() => {
        if (!user || user.role === null) {
            fetchData().then(data => {
                dispatch(login(data.user));
                if (data.user.role !== 'admin') {
                    navigate('/forbidden');
                }
            }).catch(error => {
                console.error(error);
            });
        }
        const fetchCustomerData = async () => {
            try {
                const customerData = await getCustomerDataFromID(id);
                setCustomerData(customerData);
            } catch (error) {
                console.error('Müşteri bilgileri alınırken bir hata oluştu:', error);
            }
            setLoading(false);

        };
        fetchParameters();
        fetchCustomerData();
    }, [id]);

    useEffect(() => {
        setstateData(State.getStatesOfCountry(country?.isoCode));
    }, [country]);

    useEffect(() => {
        setCountyData(City.getCitiesOfState(country?.isoCode, state?.isoCode));
    }, [state]);

    useEffect(() => {
        stateData && setState(stateData[0]);
    }, [stateData]);

    useEffect(() => {
        county && setCounty(countyData[0]);
    }, [countyData]);


    const fetchParameters = async () => {
        await axios.get(`${process.env.REACT_APP_API_URL}/api/parameters`)
            .then(response => {
                setParameters(response.data);

            })
            .catch(error => {
                console.error('Roles fetching failed:', error);
            });
    };
    const getCustomerDataFromID = async (id) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers/${id}`);
            setCustomerData(response.data);
            return response.data;
        } catch (error) {
            setLoading(false);
            console.error('Customers fetching failed:', error);
            return null;
        }
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/customers/${id}`, {

                companyname: values.companyname,
                companytype: values.companytype,
                companysector: values.companysector,
                companyadress: values.companyadress,
                companycountry: country ? country.name : values.companycountry,
                companycity: state ? state.name : values.companycity,
                companycounty: county ? county.name : values.companycounty,
                companyweb: values.companyweb,
                contactname: values.contactname,
                contactmail: values.contactmail,
                contactnumber: values.contactnumber,
            });
            Notification("success", t("editCustomer.customer_edited_success"));
            navigate("/adminhome");
            setLoading(false);
            setCustomerData(response.data);
            form.resetFields();
        } catch (error) {
            Notification(false, t("editCustomer.customer_edited_error"));
            console.error('Müşteri güncellenirken bir hata oluştu:', error);
            setLoading(false);
        }
    };


    return (
        <>
            <NavBar />
            {loading ? (
                <Loading />
            ) : (
                <div className="body">
                    <Button
                        type="link"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(-1)}
                    >
                        {t("admin_detail.back")}
                    </Button>
                    <div className='w-full flex flex items-center justify-center'>
                        
                        <div
                            className=" w-full h-full  p-4 rounded-lg border shadow bg-[#F9F9F9] rounded-xl shadow-md "
                            onClick={(e) => e.stopPropagation()}
                        ><div className="flex items-center h-[100px] border-b-2 border-gray-200 pb-2 bg-white p-[16px 24px] gap-16 border-t-0 border-l-0 border-b-0 rounded-md">
                                <div className="w-full mb-4">
                                    <div className="mt-5">

                                        <div
                                            className="text-2xl text-[#383838] font-sans font-medium ml-6"
                                        >
                                            {customerData.companyname}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4 mt-4 flex flex-wrap inline-block bg-blue-200 rounded-full px-3 py-1 text-sm font-semibold text-[#2B4D55] w-[150px]">
                                {t("customer_detail.company_info")}
                            </div>
                            <div className="flex items-center bg-white shadow-sm rounded-lg h-auto p-4">
                                <div className="w-full">
                                    <div className="my-4">
                                        <div className="text-lg p-4 font-normal grid grid-cols-2 ml-2">
                                            <div>


                                                <div className="flex items-center mb-2">
                                                    <strong><ShopOutlined className="text-gray-400 mr-2" /> {t("customer_detail.type")}</strong>
                                                </div>

                                                <div className="flex items-center mb-2">
                                                    <strong><BankOutlined className="text-gray-400 mr-2" /> {t("customer_detail.sector")}</strong>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    <strong><GlobalOutlined className="text-gray-400 mr-2" /> {t("customer_detail.website")}</strong>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    <strong><EnvironmentOutlined className="text-gray-400 mr-2" /> {t("customer_detail.country")}</strong>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    <strong><EnvironmentOutlined className="text-gray-400 mr-2" /> {t("customer_detail.city")}</strong>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    <strong><EnvironmentOutlined className="text-gray-400 mr-2" /> {t("customer_detail.county")}</strong>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    <strong><EnvironmentOutlined className="text-gray-400 mr-2" /> {t("customer_detail.address")}</strong>
                                                </div>

                                            </div>
                                            <div>
                                                <div className="flex items-center mb-2">
                                                    <span>{customerData.companytype}</span>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    <span>{customerData.companysector}</span>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    <span>{customerData.companyweb}</span>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    <span>{customerData.companycountry}</span>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    <span>{customerData.companycounty}</span>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    <span>{customerData.companycounty}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span>{customerData.companyadress}</span>
                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="mb-4 mt-4 flex flex-wrap inline-block bg-blue-200 rounded-full px-3 py-1 text-sm font-semibold text-[#2B4D55] w-[200px]">
                            {t("customer_detail.contact_info")}
                            </div>
                            <div className="flex items-center h-auto bg-white shadow-sm rounded-lg p-1">
                                <div className="w-full mb-4">
                                    <div className="mt-5">
                                        <div className="text-lg p-4 font-normal ml-2 grid grid-cols-2">
                                            <div>
                                                <div className="flex items-center mb-2">
                                                    <UserOutlined className="text-gray-400 mr-2" />
                                                    <strong>{t("customer_detail.name_surname")}</strong>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    <MailOutlined className="text-gray-400 mr-2" />
                                                    <strong>{t("customer_detail.email")}</strong>
                                                </div>
                                                <div className="flex items-center">
                                                    <PhoneOutlined className="text-gray-400 mr-2" />
                                                    <strong>{t("customer_detail.phone")}</strong>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-center mb-2">
                                                    {customerData.contactname}
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    {customerData.contactmail}
                                                </div>
                                                <div className="flex items-center">
                                                    {customerData.contactnumber}
                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            )}
        </>

    );
};

export default EditCustomerForm;
