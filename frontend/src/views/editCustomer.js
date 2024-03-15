import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Select } from 'antd';
import axios from "axios";
import Notification from '../utils/notification';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/authSlice';
import { fetchData } from '../utils/fetchData';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { number } from 'prop-types';
 
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
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
  const { id } = useParams();
  const [parameters, setParameters] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [phone, setPhone] = useState('');
  const [countryid, setCountryid] = useState(0);
  const [stateid, setstateid] = useState(0);
  
 
  useEffect(() => {
    if (!user || user.role === null) {
      console.log("girdi");
      fetchData().then(data => {
        console.log("cevap:", data);
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
        setCountryid(customerData.companycountry)
      } catch (error) {
        console.error('Müşteri bilgileri alınırken bir hata oluştu:', error);
      }
    };
    fetchParameters();
    fetchCustomerData();
  }, [id]);
  const fetchParameters = async () => {
    await axios.get(`${process.env.REACT_APP_API_URL}/api/parameters`)
      .then(response => {
        console.log(response);
        console.log("DATAA PARAMETER: " + response.data);
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
      console.log("gelen ülke"+response.data.companycountry);
      return response.data;
    } catch (error) {
      console.error('Customers fetching failed:', error);
      return null;
    }
  };
 
  const handleSubmit = async (values) => {
    console.log(values);
    console.log("test" + id);
    
    setLoading(true);
    try {
      
        const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/customers/${id}`, {
          
            companyname: values.companyname,
            companytype: values.companytype,
            companysector: values.companysector,
            companyadress: values.companyadress,
            companycity: values.companycity.name,
            companycountry: values.companycountry.name,
            companycounty: values.companycounty.name,
            companyweb: values.companyweb,
            contactname: values.contactname,
            contactmail: values.contactmail,
            contactnumber: values.contactnumber,
        });
        
 
        Notification("success", "Müşteri bilgileri güncellendi.","Müşteri bilgileri başarılı bir şekilde güncellendi");
         setTimeout(() => {
                navigate('/adminhome');
            }, 2000);
        setLoading(false);
        setCustomerData(response.data);
        form.resetFields();
    } catch (error) {
        Notification("error", "Müşteri bilgileri güncellenemedi.","Müşteri bilgileri güncellenemedi Lütfen Tekrar Deneyiniz");
        console.error('Müşteri güncellenirken bir hata oluştu:', error);
        setLoading(false);
    }
};
 
 
  return (
    <div className="flex justify-center items-center v-screen">
      <div className="w-full max-w-lg my-10">
      <h2 className="text-center text-2xl mb-6">Müşteri Düzenle</h2>
      {customerData && (
          <Form
            form={form}
            initialValues={customerData}
            onFinish={handleSubmit}
            layout="vertical"
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <Form.Item label="Firma Adı" name="companyname" rules={[{ required: true, message: 'Firma adını giriniz!' }]}>
                <Input placeholder="Firma Adı" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </Form.Item>
              <Form.Item label="Firma Türü" name="companytype" rules={[{ required: true, message: 'Firma türünü giriniz!' }]}>
                <Select showSearch optionFilterProp="children" placeholder="Firma Türü Seç">
                  {parameters.map((parameter, index) => {
                    if (parameter.title === "Firma Türü") {
                      return parameter.values.map((value, idx) => (
                        <Option key={`${parameter._id}-${idx}`} value={value}>
                          {value}
                        </Option>
                      ));
                    }
                    return null;
                  })}
                </Select>
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item label="Sektör" name="companysector" rules={[{ required: true, message: 'Sektör giriniz!' }]}>
                <Select showSearch optionFilterProp="children" placeholder="Sektör Seç">
                  {parameters.map((parameter, index) => {
                    if (parameter.title === "Sektör") {
                      return parameter.values.map((value, idx) => (
                        <Option key={`${parameter._id}-${idx}`} value={value}>
                          {value}
                        </Option>
                      ));
                    }
                    return null;
                  })}
                </Select>
              </Form.Item>
              <Form.Item label="Web Sitesi" name="companyweb" rules={[{ required: true, message: 'Web sitesi giriniz!' }]}>
                <Input placeholder="Web Sitesi" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </Form.Item>
 
 
 
 
            </div>
            <div className="grid grid-cols-2 gap-4">
 
              <Form.Item label="İlgili Kişi" name="contactname" rules={[{ required: true, message: 'İlgili kişi giriniz!' }]}>
                <Input placeholder="İlgili Kişi" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </Form.Item>
              <Form.Item label="İlgili Kişi Email" name="contactmail" rules={[{ required: true, message: 'Email giriniz!', type: 'email', message: 'Geçerli bir email adresi giriniz!' }]}>
                <Input placeholder="İlgili Kişi Email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-4">
 
              <Form.Item label="İlgili Kişi Telefon numarası" name='contactnumber' rules={[{
                required: true, type: number, message: 'Geçerli bir telefon numarası giriniz.',
                validator: (_, value) => {
                  if (value && !isPhoneValid(value)) {
                    return Promise.reject('Geçerli bir telefon numarası giriniz!');
                  }
                  return Promise.resolve();
                }
              }]}>
                <PhoneInput
 
                  defaultCountry="tr"
                  value={phone}
                  onChange={(phone) => setPhone(phone)}
                />
 
              </Form.Item>
              <Form.Item label="Ülke" name="companycountry" rules={[{ required: true, message: 'Ülke giriniz!' }]}>
                <CountrySelect
                  onChange={(e) => {
                    setCountryid(e.id);
                  }}
                  placeholder="Select Country"
                />
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-4">
 
            <Form.Item label="Şehir" name="companycity" rules={[{ required: true, message: 'İl seçiniz!' }]}>
              <StateSelect
                countryid={countryid}
                onChange={(e) => {
                  setstateid(e.id);
                }}
                placeholder="Select State"
              />
 
            </Form.Item>
                <Form.Item label="İlçe" name="companycounty" rules={[{ required: true, message: 'İlçe seçiniz!' }]} >
                  <CitySelect
                    countryid={countryid}
                    stateid={stateid}
                    onChange={(e) => {
                      
                      console.log(e.id);
                    }}
                    placeholder="Select City"
                  />
                </Form.Item>
            </div>
            <Form.Item label="Adres" name="companyadress" rules={[{ required: true, message: 'Adres giriniz!' }]}>
              <Input.TextArea placeholder="Adres" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </Form.Item>
            <Form.Item>
              <Button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold  px-2 rounded focus:outline-none focus:shadow-outline" type="primary" htmlType="submit" loading={loading}>
                Güncelle
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
};
 
export default EditCustomerForm;
