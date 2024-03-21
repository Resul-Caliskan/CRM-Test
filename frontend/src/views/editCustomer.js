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
import { City, Country, State } from "country-state-city"

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
  const [stateData, setstateData] = useState();
  const [countyData, setCountyData] = useState();
  const [state, setState] = useState()
  const [county, setCounty] = useState()
  let countryData = Country.getAllCountries();
  const [country, setCountry] = useState();
  const handleCountryChange = (value) => {
    const selectedCountry = countryData[value];
    setCountry(selectedCountry);
    console.log(country);
  };

  const handleCityChange = (value) => {
    console.log(value);
    const selectedCityInfo = stateData.find(city => city.isoCode === value);
    setState(selectedCityInfo)
    console.log(selectedCityInfo);
  }

  const handleCountyChange = (value) => {
    console.log(value+" mahalle");
    const selectedCountyInfo = countyData.find(county => county.name === value);
    console.log(selectedCountyInfo);
    setCounty(selectedCountyInfo);
  };
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
      } catch (error) {
        console.error('Müşteri bilgileri alınırken bir hata oluştu:', error);
      }
    };
    fetchParameters();
    fetchCustomerData();
  }, [id]);

  useEffect(() => {
    setstateData(State.getStatesOfCountry(country?.isoCode));
    console.log(country?.isoCode);
  }, [country]);

  useEffect(() => {
    setCountyData(City.getCitiesOfState(country?.isoCode, state?.isoCode));
    console.log(country?.isoCode, state?.isoCode)
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
      console.log("gelen ülke" + response.data.companycountry);
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
      console.log(values.companycountry + "  " + values.companycity + "  " + values.companycounty);
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/customers/${id}`, {

        companyname: values.companyname,
        companytype: values.companytype,
        companysector: values.companysector,
        companyadress: values.companyadress,
        companycountry: country ? country.name :values.companycountry,
        companycity: state? state.name:values.companycity,
        companycounty: county ? county.name:values.companycounty,
        companyweb: values.companyweb,
        contactname: values.contactname,
        contactmail: values.contactmail,
        contactnumber: values.contactnumber,
      });
      console.log("girdi dayi")

      Notification("success", "Müşteri bilgileri güncellendi.");
      navigate("/adminhome");
      setLoading(false);
      setCustomerData(response.data);
      form.resetFields();
    } catch (error) {
      Notification(false, "Müşteri bilgileri güncellenemedi.");
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
            <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4">
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
            <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4">
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
            <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4">

              <Form.Item label="İlgili Kişi" name="contactname" rules={[{ required: true, message: 'İlgili kişi giriniz!' }]}>
                <Input placeholder="İlgili Kişi" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </Form.Item>
              <Form.Item label="İlgili Kişi Email" name="contactmail" rules={[{ required: true, message: 'Email giriniz!', type: 'email', message: 'Geçerli bir email adresi giriniz!' }]}>
                <Input placeholder="İlgili Kişi Email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </Form.Item>
            </div>
            <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4">

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
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  value={country ? country.isoCode : undefined}
                  placeholder="Ülke seç"
                  optionFilterProp="children"
                  onChange={(value) => {
                    handleCountryChange(value);
                  }}
                  filterOption={(input, option) =>
                    option.children.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
                  }
                >
                  {Object.keys(countryData).map((countryCode, index) => (
                    <Option key={index} value={countryCode}>
                      {countryData[countryCode].name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className='grid sm:grid-cols-1 lg:grid-cols-2 gap-4'>



              <Form.Item label="Şehir" name="companycity" rules={[{ required: true, message: 'Şehir seçiniz!' }]} >
                <Select

                  showSearch
                  style={{ width: '100%' }}
                  value={state ? state.isoCode : undefined}
                  placeholder="Şehir seç"
                  optionFilterProp="children"
                  onChange={(value) => {
                    handleCityChange(value);
                  }}
                  filterOption={(input, option) =>
                    option.children.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
                  }
                >
                  {stateData && stateData.map((state, index) => (
                    <Option key={index} value={state.isoCode}>
                      {state.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="İlçe" name="companycounty" rules={[{ required: true, message: 'İlçe seçiniz!' }]}>
                <Select

                  showSearch
                  style={{ width: '100%' }}
                  value={county ? county.name:undefined }
                  placeholder="İlçe seç"
                  optionFilterProp="children"
                  onChange={(value) => {
                    handleCountyChange(value);
                  }}
                  filterOption={(input, option) =>
                    option.children.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
                  }
                >
                  {countyData && countyData.map((county, index) => (
                    <Option key={index} value={county.name}>
                      {county.name}
                    </Option>
                  ))}
                </Select>
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
