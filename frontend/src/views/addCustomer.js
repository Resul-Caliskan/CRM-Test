import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../utils/fetchData";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/authSlice";
import axios from "axios";
import Notification from "../utils/notification";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { PhoneNumberUtil } from "google-libphonenumber";
import { number } from "prop-types";
import { City, Country, State } from "country-state-city";
import { setSelectedOption } from "../redux/selectedOptionSlice";

import "react-country-state-city/dist/react-country-state-city.css";
import Loading from "../components/loadingComponent";
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
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  useSelector((state) => state.selectedOption.selectedOption);
  const [phone, setPhone] = useState("");
  const [parameters, setParameters] = useState([]);
  const [stateData, setstateData] = useState();
  const [countyData, setCountyData] = useState();
  const [state, setState] = useState();
  const [county, setCounty] = useState();
  let countryData = Country.getAllCountries();
  const [country, setCountry] = useState();
  const handleCountryChange = (value) => {
    const selectedCountry = countryData[value];
    setCountry(selectedCountry);
    console.log(country);
  };

  const handleCityChange = (value) => {
    console.log(value);
    const selectedCityInfo = stateData.find((city) => city.isoCode === value);
    setState(selectedCityInfo);
    console.log(selectedCityInfo);
  };

  const handleCountyChange = (value) => {
    console.log(value + " mahalle");
    const selectedCountyInfo = countyData.find(
      (county) => county.name === value
    );
    console.log(selectedCountyInfo);
    setCounty(selectedCountyInfo);
  };

  useEffect(() => {
    if (!user || user.role === null) {
      console.log("girdi");
      fetchData()
        .then((data) => {
          console.log("cevap:", data);
          dispatch(login(data.user));

          if (data.user.role !== "admin") {
            navigate("/forbidden");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    fetchParameters();
  }, []);
  useEffect(() => {
    setstateData(State.getStatesOfCountry(country?.isoCode));
    console.log(country?.isoCode);
  }, [country]);

  useEffect(() => {
    setCountyData(City.getCitiesOfState(country?.isoCode, state?.isoCode));
    console.log(country?.isoCode, state?.isoCode);
  }, [state]);

  useEffect(() => {
    stateData && setState(stateData[0]);
  }, [stateData]);

  useEffect(() => {
    county && setCounty(countyData[0]);
  }, [countyData]);
  const fetchParameters = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/api/parameters`)
      .then((response) => {
        console.log(response);
        console.log("DATAA PARAMETER: " + response.data);
        setParameters(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Roles fetching failed:", error);
      });
  };
  const handleSubmit = async (values) => {
    console.log("api url" + `${apiUrl}/api/customers`);
    setLoading(true);
    console.log(country.name + " " + state.name + " " + county.name);
    try {
      const response = await axios.post(`${apiUrl}/api/customers`, {
        companyname: values.companyName,
        companytype: values.companyType,
        companysector: values.industry,
        companyadress: values.address,
        companycity: state.name,
        companycountry: country.name,
        companycounty: county.name,
        companyweb: values.website,
        contactname: values.contactPerson,
        contactmail: values.contactEmail,
        contactnumber: values.contactPhoneNumber,
      });

      if (response.status !== 201) {
        throw new Error("Bir hata oluştu");
      }

      console.log("Form gönderildi:", values);
      Notification("success", "Müşteri başarıyla eklendi.");
      setTimeout(() => {
        dispatch(setSelectedOption("candidates"));
      }, 1500);
      setLoading(false);
      form.resetFields();
    } catch (error) {
      setLoading(false);
      console.error("error", values);
      Notification("error", "Müşteri eklenirken bir hata oluştu.");
    }
  };

  return (
    <>
    {loading ? <Loading /> 
       : (
    <div className="flex justify-center items-center w-screen mt-5">
    
      <div className="w-full max-w-lg">
      <button
          className="text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-500/30 font-medium rounded-lg text-sm px-3 py-2.5 text-center flex items-center justify-center me-2 mb-2"
          onClick={() =>  dispatch(setSelectedOption("list-customer"))}
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
        <h2 className="text-center text-2xl mb-6">Müşteri Ekle</h2>
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <Form.Item
              label="Firma Adı"
              name="companyName"
              rules={[{ required: true, message: "Firma adını giriniz!" }]}
            >
              <Input
                placeholder="Firma Adı"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
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

          <div className="grid sm:grid-cols-2 gap-4">
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
            <Form.Item
              label="Web Sitesi"
              name="website"
              rules={[{ required: true, message: "Web sitesi giriniz!" }]}
            >
              <Input
                placeholder="Web Sitesi"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </Form.Item>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Form.Item
              label="İlgili Kişi"
              name="contactPerson"
              rules={[{ required: true, message: "İlgili kişi giriniz!" }]}
            >
              <Input
                placeholder="İlgili Kişi"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </Form.Item>
            <Form.Item
              label="İlgili Kişi Email"
              name="contactEmail"
              rules={[
                {
                  required: true,
                  message: "Email giriniz!",
                  type: "email",
                  message: "Geçerli bir email adresi giriniz!",
                },
              ]}
            >
              <Input
                placeholder="İlgili Kişi Email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </Form.Item>
          </div>
          <div className="grid sm:grid-cols-2  gap-4">
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
            <Form.Item
              label="Ülke"
              name="country"
              rules={[{ required: true, message: "Ülke giriniz!" }]}
            >
              <Select
                showSearch
                style={{ width: "100%" }}
                value={country ? country.isoCode : undefined}
                placeholder="Ülke seç"
                optionFilterProp="children"
                onChange={(value) => {
                  handleCountryChange(value);
                }}
                filterOption={(input, option) =>
                  option.children
                    .toString()
                    .toLowerCase()
                    .indexOf(input.toString().toLowerCase()) >= 0
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
          <div className="grid sm:grid-cols-2 gap-4">
            <Form.Item
              label="Şehir"
              name=" "
              rules={[{ required: true, message: "İl seçiniz!" }]}
            >
              <Select
                showSearch
                style={{ width: "100%" }}
                value={state ? state.isoCode : undefined}
                placeholder="Şehir seç"
                optionFilterProp="children"
                onChange={(value) => {
                  handleCityChange(value);
                }}
                filterOption={(input, option) =>
                  option.children
                    .toString()
                    .toLowerCase()
                    .indexOf(input.toString().toLowerCase()) >= 0
                }
              >
                {stateData &&
                  stateData.map((state, index) => (
                    <Option key={index} value={state.isoCode}>
                      {state.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="İlçe"
              name="ilce"
              rules={[{ required: true, message: "İlçe seçiniz!" }]}
            >
              <Select
                showSearch
                style={{ width: "100%" }}
                value={county ? county.name : undefined}
                placeholder="İlçe seç"
                optionFilterProp="children"
                onChange={(value) => {
                  handleCountyChange(value);
                }}
                filterOption={(input, option) =>
                  option.children
                    .toString()
                    .toLowerCase()
                    .indexOf(input.toString().toLowerCase()) >= 0
                }
              >
                {countyData &&
                  countyData.map((county, index) => (
                    <Option key={index} value={county.name}>
                      {county.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </div>
          <Form.Item
            label="Adres"
            name="address"
            rules={[{ required: true, message: "Adres giriniz!" }]}
          >
            <Input.TextArea
              placeholder="Adres"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold  px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Kaydet
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
       )
    }
    </>
  );
};

export default CompanyForm;
