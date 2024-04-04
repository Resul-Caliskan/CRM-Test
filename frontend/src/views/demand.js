import { useState, useEffect } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { PhoneInput } from 'react-international-phone';
import { number } from 'prop-types';
import Notification from '../utils/notification';
import { setSelectedOption } from '../redux/selectedOptionSlice';
import { setUserSelectedOption } from '../redux/userSelectedOptionSlice';
import { useDispatch, useSelector } from 'react-redux';

const { Option } = Select;
const phoneUtil = PhoneNumberUtil.getInstance();
const isPhoneValid = (phone) => {
    try {
        return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
    } catch (error) {
        return false;
    }
};

const DemandForm = () => {
    const [form] = Form.useForm();
    const [companies, setCompanies] = useState([]);
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const selectedOption = useSelector(
      (state) => state.selectedOption.selectedOption
    );
    useEffect(() => {
        console.log("GİRDİİİİİİAAASDASFSA");
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        await axios.get(`${process.env.REACT_APP_API_URL}/api/customers`)
            .then(response => {
                console.log(response);
                setCompanies(response.data);


            })
            .catch(error => {
                console.error('Roles fetching failed:', error);
            });
    };

    const handleFormSubmit = async (values) => {
        try {
            const formData = {
                companyName: values.companyName,
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                phone: values.phone,

            };


            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/demand`,
                {
                    name: formData.firstName,
                    surname: formData.lastName,
                    number: formData.phone,
                    email: formData.email,
                    companyname: companies[formData.companyName].companyname,
                    companyId: companies[formData.companyName]._id,
                });
            Notification("success", "Talep Oluşturuldu.","Talebiniz alınmıştır. Onaylandığında size bildirim gönderilecektir. ");
            setTimeout(() => {
                navigate('/');
            }, 1000);



            form.resetFields();
        } catch (error) {
            console.error("İstek yapılırken bir hata oluştu:", error);
            Notification(false, "Kayıt eklenirken hata oluştu");
        }
    };

    return (
        <div className="flex justify-center items-center">
            <div className="w-full max-w-md mt-12">
                <h2 className="text-center text-2xl mb-6">Talep Oluştur</h2>
                <button
                className="text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-500/30 font-medium rounded-lg text-sm px-3 py-2.5 text-center flex items-center justify-center me-2 mb-2"
                onClick={() => {
                  if (user.role === "admin") {
                    dispatch(setSelectedOption("list-demands"));
                  } else {
                    dispatch(setUserSelectedOption("position"));
                  }
                }}

              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Geri Dön
              </button>
                <Form
                    form={form}
                    onFinish={handleFormSubmit}
                    layout="vertical"
                    className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                >
                    <Form.Item
                        label="Şirket Adı"
                        name="companyName"
                        rules={[{ required: true, message: 'Lütfen şirket adını seçiniz!' }]}
                    >
                        <Select placeholder="Şirket Seç">
                            {companies.map((company, index) => (
                                <Option key={company._id} value={index}>{company.companyname}</Option>


                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="İsim"
                        name="firstName"
                        rules={[{ required: true, message: 'Lütfen isminizi giriniz!' }]}
                    >
                        <Input placeholder="İsim" />
                    </Form.Item>
                    <Form.Item
                        label="Soyisim"
                        name="lastName"
                        rules={[{ required: true, message: 'Lütfen soyisminizi giriniz!' }]}
                    >
                        <Input placeholder="Soyisim" />
                    </Form.Item>
                    <Form.Item
                        label="E-mail"
                        name="email"
                        rules={[{ required: true, type: 'email', message: 'Lütfen geçerli bir e-mail adresi giriniz!' }]}
                    >
                        <Input placeholder="E-mail" />
                    </Form.Item>
                    <Form.Item label="İlgili Kişi Telefon numarası" name='phone' rules={[{
                        required: true, type: number, message: 'Geçerli bir telefon numarası giriniz.',
                        validator: (_, value) => {
                            if (value && !isPhoneValid(value) && value.length>3) {
                                return Promise.reject('Geçerli bir telefon numarası giriniz!');
                            }
                            return Promise.resolve();
                        }
                    }]}>
                        <PhoneInput
                            className=''
                            defaultCountry="tr"
                            value={phone}
                            onChange={(phone) => setPhone(phone)}
                        />

                    </Form.Item>
                    
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="border w-full my-8 bg-indigo-600 hover:bg-indigo-500 text-white flex justify-center"
                            style={{ borderRadius: '0.375rem' }}
                        >
                            Kaydet
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default DemandForm;