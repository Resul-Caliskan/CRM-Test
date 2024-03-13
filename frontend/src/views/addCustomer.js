
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useNavigate } from 'react-router-dom'
import { fetchData } from '../utils/fetchData';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/authSlice';
import axios from "axios";
import Notification from "../utils/notification";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { PhoneNumberUtil } from "google-libphonenumber";
import { number } from "prop-types";

import {
  CitySelect,
  CountrySelect,
  StateSelect,
  LanguageSelect,
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
const CompanyForm = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [cities, setCities] = useState([]);
  const [phone, setPhone] = useState('');
  const isValid = isPhoneValid(phone);

  const [countryid, setCountryid] = useState(0);
  const [stateid, setstateid] = useState(0);
  const [parameters, setParameters] = useState([]);


  useEffect(() => {
    // Ülkeleri çeken API isteği
    /* axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        // Ülkeleri alfabeye göre sırala
        const sortedCountries = response.data.sort((a, b) => {
          if (a.name.common < b.name.common) return -1;
          if (a.name.common > b.name.common) return 1;
          return 0;
        });
        setCountries(sortedCountries);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
      });*/

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
    fetchParameters();
  }, [])
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

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };
  const handleSubmit = async (values) => {
    console.log("api url"+ `${apiUrl}/api/customers`);
    setLoading(true);
    try {
      const response = await axios.post( `${apiUrl}/api/customers`, {
        companyname: values.companyName,
        companytype: values.companyType,
        companysector: values.industry,
        companyadress: values.address,
        companycity: [values.city.id,values.city.name],
        companycountry: [values.country.id,values.country.name,],
        companycounty:[values.ilce.id,values.ilce.name],
        companyweb: values.website,
        contactname: values.contactPerson,
        contactmail: values.contactEmail,
        contactnumber: values.contactPhoneNumber,
      });

      if (response.status !== 201) {
        throw new Error('Bir hata oluştu');
      }

      console.log('Form gönderildi:', values);
      setLoading(false);
      form.resetFields();
    } catch (error) {

      console.error('sdsds', values);

      Notification(true, "Müşteri başarıyla eklendi.");
      setTimeout(() => {
        navigate('/adminhome');
      }, 2000);
    }
  };

  return (
    <div className="flex justify-center items-center w-screen mt-5">
      <div className="w-full max-w-lg">
        <h2 className="text-center text-2xl mb-6">Firma Ekle</h2>
        <Form form={form} onFinish={handleSubmit} layout="vertical" className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Firma Adı" name="companyName" rules={[{ required: true, message: 'Firma adını giriniz!' }]}>
              <Input placeholder="Firma Adı" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </Form.Item>
            <Form.Item
              label="Firma Türü"
              name="companyType"
              rules={[{ required: true, message: "Firma türünü giriniz!" }]}
            >
              <Select
                showSearch
                optionFilterProp="children"
                placeholder="Firma Türü Seç"
              >
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
            <Form.Item
              label="Sektör"
              name="industry"
              rules={[{ required: true, message: "Sektör giriniz!" }]}
            >
              <Select
                showSearch
                optionFilterProp="children"
                placeholder="Sektör Seç"
              >
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
            <Form.Item label="Web Sitesi" name="website" rules={[{ required: true, message: 'Web sitesi giriniz!' }]}>
              <Input placeholder="Web Sitesi" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </Form.Item>




          </div>
          <div className="grid grid-cols-2 gap-4">

            <Form.Item label="İlgili Kişi" name="contactPerson" rules={[{ required: true, message: 'İlgili kişi giriniz!' }]}>
              <Input placeholder="İlgili Kişi" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </Form.Item>
            <Form.Item label="İlgili Kişi Email" name="contactEmail" rules={[{ required: true, message: 'Email giriniz!', type: 'email', message: 'Geçerli bir email adresi giriniz!' }]}>
              <Input placeholder="İlgili Kişi Email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="İlgili Kişi Telefon numarası"
              name="contactPhoneNumber"
              rules={[
                {
                  required: true,
                  type: number,
                  message: "Geçerli bir telefon numarası giriniz.",
                  validator: (_, value) => {
                    if (value && !isPhoneValid(value)) {
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
                defaultCountry="tr"
                value={phone}
                onChange={(phone) => setPhone(phone)}
              />

            </Form.Item>
            <Form.Item label="Ülke" name="country" rules={[{ required: true, message: 'Ülke giriniz!' }]}>
              <CountrySelect
                onChange={(e) => {
                  setCountryid(e.id);
                }}
                placeholder="Select Country"
              />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4">

            <Form.Item label="Şehir" name="city" rules={[{ required: true, message: 'İl seçiniz!' }]}>
              <StateSelect
                countryid={countryid}
                onChange={(e) => {
                  setstateid(e.id);
                }}
                placeholder="Select State"
              />

            </Form.Item>
            <Form.Item label="İlçe" name="ilce" rules={[{ required: true, message: 'İlçe seçiniz!' }]} >
              <CitySelect
                countryid={countryid}
                stateid={stateid}
                onChange={(e) => {
                  console.log(e);
                }}
                placeholder="Select City"
              />
            </Form.Item>
          </div>
          <Form.Item label="Adres" name="address" rules={[{ required: true, message: 'Adres giriniz!' }]}>
            <Input.TextArea placeholder="Adres" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold  px-4 rounded focus:outline-none focus:shadow-outline">
              Kaydet
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CompanyForm;
