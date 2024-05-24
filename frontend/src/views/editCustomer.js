import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Button, Select } from "antd";
import axios from "axios";
import Notification from "../utils/notification";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/authSlice";
import { fetchData } from "../utils/fetchData";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { PhoneNumberUtil } from "google-libphonenumber";
import { number } from "prop-types";
import { City, Country, State } from "country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import NavBar from "../components/adminNavBar";
import Loading from "../components/loadingComponent";
import { setSelectedOption } from "../redux/selectedOptionSlice";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

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
  const [phone, setPhone] = useState("");
  const [stateData, setstateData] = useState();
  const [countyData, setCountyData] = useState();
  const [state, setState] = useState();
  const [county, setCounty] = useState();
  let countryData = Country.getAllCountries();
  const [country, setCountry] = useState();
  const { t, i18n } = useTranslation();
  const [gCountry, setgCountry] = useState();

  useSelector((state) => state.selectedOption.selectedOption);

  const handleCountryChange = (value) => {
    const selectedCountry = countryData[value];
    setCountry(selectedCountry);
  };

  const handleCityChange = (value) => { 
    const selectedCityInfo = stateData.find((city) => city.isoCode === value);
    setState(selectedCityInfo);
  };

  const handleCountyChange = (value) => {
    const selectedCountyInfo = countyData.find(
      (county) => county.name === value
    );
    setCounty(selectedCountyInfo);
  };
  const fetchCustomerData = async () => {
    try {
      const customerData = await getCustomerDataFromID(id);
      setCustomerData(customerData);
      const customerCountry = countryData.find((country) => country.name === customerData.companycountry);
  
      setCountry(customerCountry);
    } catch (error) {
      console.error("Müşteri bilgileri alınırken bir hata oluştu:", error);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (!user || user.role === null) {
      fetchData()
        .then((data) => {
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
    await axios
      .get(`${process.env.REACT_APP_API_URL}/api/parameters`)
      .then((response) => {
        setParameters(response.data);
      })
      .catch((error) => {
        console.error("Roles fetching failed:", error);
      });
  };
  const getCustomerDataFromID = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/customers/${id}`
      );
         // Müşteri verilerini al
    const customerData = response.data;
    
    // Companycountry değerini al
    const companyCountryCode = customerData.companycountry;
    
    // Companycountry değerini i18n çevirileriyle eşleştir
    const translatedCountryName = t(`countries.${companyCountryCode}`);
    
    // Eşleşen ülke adını müşteri verilerine ekle
    customerData.companycountry = translatedCountryName;
    
    // Müşteri verilerini ayarla
    setCustomerData(customerData);

      return response.data;
    } catch (error) {
      setLoading(false);
      console.error("Customers fetching failed:", error);
      return null;
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/customers/${id}`,
        {
          companyname: values.companyname,
          companytype: values.companytype,
          companysector: values.companysector,
          companyadress: values.companyadress,
          companycountry: country ? country.isoCode : values.companycountry,
          companycity: state ? state.name : values.companycity,
          companycounty: county ? county.name : values.companycounty,
          companyweb: values.companyweb,
          contactname: values.contactname,
          contactmail: values.contactmail,
          contactnumber: values.contactnumber,
        }
      );
      Notification("success", t("editCustomer.customer_edited_success"));
      navigate("/adminhome");
      setLoading(false);
      setCustomerData(response.data);
      form.resetFields();
    } catch (error) {
      Notification(false, t("editCustomer.customer_edited_error"));
      console.error("Müşteri güncellenirken bir hata oluştu:", error);
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
          <div className="w-full">
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={() => {
                if (user?.role === "admin") {
                  navigate("/adminhome");
                  dispatch(setSelectedOption("list-customers"));
                }
              }}
            >
              {t("editCustomer.back")}
            </Button>
            <h2 className="text-center text-2xl">
              {t("editCustomer.customer_form_title")}
            </h2>
            {customerData && (
              <Form
                form={form}
                initialValues={customerData}
                onFinish={handleSubmit}
                layout="vertical"
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-4"
              >
                <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4">
                  <Form.Item
                    label={t("editCustomer.company_name_label")}
                    name="companyname"
                    rules={[
                      {
                        required: true,
                        message: t("editCustomer.company_name_message"),
                      },
                    ]}
                  >
                    <Input
                      placeholder={t("editCustomer.company_name_placeholder")}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </Form.Item>
                  <Form.Item
                    label={t("editCustomer.company_type_label")}
                    name="companytype"
                    rules={[
                      {
                        required: true,
                        message: t("editCustomer.company_type_message"),
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      optionFilterProp="children"
                      placeholder={t("editCustomer.company_type_placeholder")}
                    >
                      {parameters.map((parameter, index) => {
                        if (parameter.title === "Firma Türü") {
                          return parameter.values.map((value, idx) => (
                            <Option
                              key={`${parameter._id}-${idx}`}
                              value={value}
                            >
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
                  <Form.Item
                    label={t("editCustomer.industry_label")}
                    name="companysector"
                    rules={[
                      {
                        required: true,
                        message: t("editCustomer.industry_message"),
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      optionFilterProp="children"
                      placeholder={t("editCustomer.industry_placeholder")}
                    >
                      {parameters.map((parameter, index) => {
                        if (parameter.title === "Sektör") {
                          return parameter.values.map((value, idx) => (
                            <Option
                              key={`${parameter._id}-${idx}`}
                              value={value}
                            >
                              {value}
                            </Option>
                          ));
                        }
                        return null;
                      })}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label={t("editCustomer.website_label")}
                    name="companyweb"
                    rules={[
                      {
                        required: true,
                        message: t("editCustomer.website_message"),
                      },
                    ]}
                  >
                    <Input
                      placeholder={t("editCustomer.website_placeholder")}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </Form.Item>
                </div>
                <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4">
                  <Form.Item
                    label={t("editCustomer.contact_person_label")}
                    name="contactname"
                    rules={[
                      {
                        required: true,
                        message: t("editCustomer.contact_person_message"),
                      },
                    ]}
                  >
                    <Input
                      placeholder={t("editCustomer.contact_person_placeholder")}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </Form.Item>
                  <Form.Item
                    label={t("editCustomer.contact_email_label")}
                    name="contactmail"
                    rules={[
                      {
                        required: true,
                        message: t("editCustomer.contact_email_message"),
                        type: "email",
                      },
                    ]}
                  >
                    <Input
                      placeholder={t("editCustomer.contact_email_placeholder")}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </Form.Item>
                </div>
                <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4">
                  <Form.Item
                    label={t("editCustomer.contact_phone_label")}
                    name="contactnumber"
                    rules={[
                      {
                        required: true,
                        type: number,
                        message: t("editCustomer.contact_phone_message"),
                        validator: (_, value) => {
                          if (value && !isPhoneValid(value)) {
                            return Promise.reject(
                              t("editCustomer.contact_phone_message")
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
                    label={t("editCustomer.country_label")}
                    name="companycountry"
                    rules={[
                      {
                        required: true,
                        message: t("editCustomer.country_message"),
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      style={{ width: "100%" }}
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
                        
                        {t(`countries.${countryData[countryCode].isoCode}`)}

                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4">
                  <Form.Item
                    label={t("editCustomer.city_label")}
                    name="companycity"
                    rules={[
                      {
                        required: true,
                        message: t("editCustomer.city_message"),
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      style={{ width: "100%" }}
                      value={state ? state.isoCode : undefined}
                      placeholder={t("editCustomer.city_placeholder")}
                      optionFilterProp="children"
                      onChange={(value) => {
                        handleCityChange(value);
                      }}
                      filterOption={(input, option) => {
                        if (country?.isoCode === "TR") {
                          const normalizedInput = input
                            .toString()
                            .replace(/[İIı]/g, (match, offset) =>
                              offset === 0 ? "i" : "i"
                            )
                            .toLowerCase();
                          const normalizedOption = option.children
                            .toString()
                            .replace(/[İIı]/g, (match, offset) =>
                              offset === 0 ? "i" : "i"
                            )
                            .toLowerCase();
                          return normalizedOption.includes(normalizedInput);
                        } else {
                          return (
                            option.children
                              .toString()
                              .toLowerCase()
                              .indexOf(input.toString().toLowerCase()) >= 0
                          );
                        }
                      }}
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
                    label={t("editCustomer.county_label")}
                    name="companycounty"
                    rules={[
                      {
                        
                        message: t("editCustomer.county_message"),
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      style={{ width: "100%" }}
                      value={county ? county.name : undefined}
                      placeholder={t("editCustomer.county_placeholder")}
                      optionFilterProp="children"
                      onChange={(value) => {
                        handleCountyChange(value);
                      }}
                      filterOption={(input, option) => {
                        if (country?.isoCode === "TR") {
                          const normalizedInput = input
                            .toString()
                            .replace(/[İIı]/g, (match, offset) =>
                              offset === 0 ? "i" : "i"
                            )
                            .toLowerCase();
                          const normalizedOption = option.children
                            .toString()
                            .replace(/[İIı]/g, (match, offset) =>
                              offset === 0 ? "i" : "i"
                            )
                            .toLowerCase();
                          return normalizedOption.includes(normalizedInput);
                        } else {
                          return (
                            option.children
                              .toString()
                              .toLowerCase()
                              .indexOf(input.toString().toLowerCase()) >= 0
                          );
                        }
                      }}
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
                  label={t("editCustomer.address_label")}
                  name="companyadress"
                  rules={[
                    {
                      required: true,
                      message: t("editCustomer.address_message"),
                    },
                  ]}
                >
                  <Input.TextArea
                    placeholder={t("editCustomer.address_placeholder")}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold  px-2 rounded focus:outline-none focus:shadow-outline"
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                  >
                    {t("editCustomer.edit_button")}
                  </Button>
                </Form.Item>
              </Form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EditCustomerForm;
