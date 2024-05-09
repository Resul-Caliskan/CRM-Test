import { Button, Form, Input } from 'antd'
import { number } from 'prop-types';
import { useEffect, useState } from 'react'
import { PhoneInput } from 'react-international-phone';
import { isPhoneValid } from '../../views/addUser';
import { useSelector } from 'react-redux';
import { IoPersonCircleSharp } from 'react-icons/io5';
import { BiSolidMessageRoundedEdit } from "react-icons/bi";
import { FaUserLarge } from "react-icons/fa6";
import { LuUser2 } from "react-icons/lu";
import { MdEdit } from "react-icons/md";
import { CiUser } from "react-icons/ci";
import { EditOutlined } from '@ant-design/icons';
import { FaUser } from "react-icons/fa";
import axios from 'axios';
import Notification from '../../utils/notification';
import { useTranslation } from 'react-i18next';
export default function UserInfo() {
    const { user } = useSelector((state) => state.auth);
    const [form] = Form.useForm();
    const [phone, setPhone] = useState("");
    const [isActive, setIsACtive] = useState(true);
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState();
    const { t, i18n } = useTranslation();
    const handleButtonClick = () => {
        setIsACtive(!isActive);
    };
    const fetchUserInfo = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/${user.id}`);
            const data = response.data
            setUserInfo(data);
            console.log(response.data);
            form.setFieldsValue(response.data);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchUserInfo();
    }, []);
    const handleSubmit = async (values) => {
        console.log("girdi");
        setLoading(true);
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/user/${user.id}`, {

                name: values.name,
                surname: values.surname,
                phone: values.phone,
                email: values.email,
            });
            Notification("success", t("profile.warnings.successfully"));
            setLoading(false);
            fetchUserInfo();

        } catch (error) {
            console.error('t("profile.warnings.error")', error);
            setLoading(false);
        }

    };
    return (
        <div className='p-5 flex flex-col w-full   overflow-auto mt-2   '>
            <div className='flex flex-row justify-start items-center gap-7 ml-4  '>
                <div className='flex relative p-4 rounded-full bg-[#d0d0d0] text-white'>
                    <FaUser className='' size={65} />
                    <button onClick={handleButtonClick} className='p-1 rounded-full bg-[#0057D9] absolute bottom-2.5 right-0 cursor-pointer ring-2 ring-white'>
                        <MdEdit className=' text-white size-5  z-20' />
                    </button>

                </div>
                <div className='flex flex-col '>
                    <h2 className='text-gray-900 text-lg'>{userInfo?.name} {userInfo?.surname}</h2>
                    <h3 className='text-sm text-gray-400'>{user.company.companyname},{user.role} </h3>
                </div>

            </div>
            <div className=' h-auto'>
                <Form
                    layout='vertical'
                    className='grid grid-cols-2 gap-5 w-full mt-5 items-center  p-5  mb-5'
                    initialValues={userInfo}
                    form={form}
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label={t("profile.labels.name")}
                        name="name"
                        className=' col-span-1'
                        required
                    >
                        <Input placeholder={t("profile.labels.name")} className=' h-10' />
                    </Form.Item>
                    <Form.Item
                        label={t("profile.labels.surname")}
                        name="surname"
                        className=' col-span-1'
                        required
                    >
                        <Input placeholder={t("profile.labels.surname")} className=' h-10 ' />
                    </Form.Item>

                    <Form.Item
                        label={t("profile.labels.email")}
                        name="email"
                        rules={[
                            {
                                required: true,
                                type: "email",
                                message: t("profile.messages.email")
                            },
                        ]}
                    >
                        <Input placeholder={t("profile.labels.email")} className=' h-10' />
                    </Form.Item>

                    <Form.Item
                        label={t("profile.labels.phone")}
                        name="phone"
                        rules={[
                            {
                                required: true,
                                type: number,
                                message: t("profile.messages.phone"),
                                validator: (_, value) => {
                                    if (value && !isPhoneValid(value) && value.length > 3) {
                                        return Promise.reject(
                                            "Geçerli bir telefon numarası giriniz!"
                                        );
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <PhoneInput

                            className="h-10 w-full mt-1"
                            defaultCountry="tr"
                            value={phone}

                            onChange={(phone) => setPhone(phone)}
                        />
                    </Form.Item>
                    <Form.Item className=' w-full col-span-2'>

                        <Button className="mb-1  py-1 h-full bg-[#0057D9] hover:bg-blue-800 text-white font-bold  px-4 rounded focus:outline-none focus:shadow-outline" type="primary" onClick={handleSubmit} loading={loading}>
                            Kaydet
                        </Button>



                    </Form.Item>



                </Form>
            </div>

        </div>
    )
}
