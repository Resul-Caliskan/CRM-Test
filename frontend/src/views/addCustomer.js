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
import { useTranslation } from "react-i18next";
import { ArrowLeftOutlined } from "@ant-design/icons";
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
  const { t, i18n } = useTranslation();
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
  const [turkeyProvinces, setTurkeyProvinces] = useState([]);
  let countryData = Country.getAllCountries();
  const [country, setCountry] = useState();
  const handleCountryChange = (value) => {
    const selectedCountry = countryData.find((country) => country.isoCode === value);
    setCountry(selectedCountry);
    setstateData(State.getStatesOfCountry(value));
    setCountyData([]); // Clear county data when country changes
  };
  

  const handleCityChange = (value) => {
    const selectedCityInfo = stateData.find((city) => city.name === value);
    setState(selectedCityInfo);
  };
  useEffect(() => {
    if (state && country) {
      setCountyData(City.getCitiesOfState(country.isoCode, state.isoCode));
    }
  }, [state, country]);

  const handleCountyChange = (value) => {
    console.log("county:" + value)
    const selectedCountyInfo = countyData.find(
      (county) => county.name === value
    );
    setCounty(selectedCountyInfo);
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
  }, []);
  useEffect(() => {
    setstateData(State.getStatesOfCountry(country?.isoCode));
  }, [country]);

  useEffect(() => {
    console.log("coutry code:" + country?.isoCode + " şehir: " + state?.isoCode);
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
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Roles fetching failed:", error);
      });
  };
  const handleSubmit = async (values) => {
    setLoading(true);
    console.log("şehiiir:" + state.name);
    try {
      const response = await axios.post(`${apiUrl}/api/customers`, {
        companyname: values.companyName,
        companytype: values.companyType,
        companysector: values.industry,
        companyadress: values.address,
        companycity: state.name,
        companycountry: country.isoCode,
        companycounty: county.name,
        companyweb: values.website,
        contactname: values.contactPerson,
        contactmail: values.contactEmail,
        contactnumber: values.contactPhoneNumber,
      });

      if (response.status === 201) {
        Notification("success", t("addCustomer.customer_add_success"));
        setTimeout(() => {
          dispatch(setSelectedOption("list-customers"));
        }, 500);
        form.resetFields();
      } else {
        throw new Error("Müşteri eklenirken bir hata oluştu.");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      let errorMessage = "Müşteri eklenirken bir hata oluştu.";
      if (
        error.response &&
        error.response.status === 409 &&
        error.response.data.error
      ) {
        errorMessage = error.response.data.error;
      }
      console.error("Error occurred while adding customer:", error);
      Notification("error", t("addCustomer.customer_add_error"));
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="body">
          <div className="flex justify-center items-center w-full ">
            <div className="w-full">
              <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={() => dispatch(setSelectedOption("list-customer"))}
              >
                {t("addCustomer.back")}
              </Button>

              <h2 className="text-center text-2xl">
                {t("addCustomer.add_customer")}
              </h2>

              <Form
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-4"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <Form.Item
                    label={t("addCustomer.company_name_label")}
                    name="companyName"
                    rules={[
                      {
                        required: true,
                        message: t("addCustomer.company_name_message"),
                      },
                    ]}
                  >
                    <Input
                     data-test="companyname"
                      placeholder={t("addCustomer.company_name_placeholder")}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </Form.Item>
                  <Form.Item
                  data-test="companytype"
                    label={t("addCustomer.company_type_label")}
                    name="companyType"
                    rules={[
                      {
                        required: true,
                        message: t("addCustomer.company_type_message"),
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      optionFilterProp="children"
                      placeholder={t("addCustomer.company_type_placeholder")}
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

                <div className="grid sm:grid-cols-2 gap-4">
                  <Form.Item
                  data-test="companyindustry"
                    label={t("addCustomer.industry_label")}
                    name="industry"
                    rules={[
                      {
                        required: true,
                        message: t("addCustomer.industry_message"),
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      optionFilterProp="children"
                      placeholder={t("addCustomer.industry_placeholder")}
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
                  
                    label={t("addCustomer.website_label")}
                    name="website"
                    rules={[
                      {
                        required: true,
                        message: t("addCustomer.website_message"),
                      },
                    ]}
                  >
                    <Input
                    data-test="website"
                      placeholder={t("addCustomer.website_placeholder")}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </Form.Item>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Form.Item
                  
                    label={t("addCustomer.contact_person_label")}
                    name="contactPerson"
                    rules={[
                      {
                        required: true,
                        message: t("addCustomer.contact_person_message"),
                      },
                    ]}
                  >
                    <Input
                    data-test="contactperson"
                      placeholder={t("addCustomer.contact_person_placeholder")}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </Form.Item>
                  <Form.Item
                    label={t("addCustomer.contact_email_label")}
                    name="contactEmail"
                    rules={[
                      {
                        required: true,
                        message: "Email giriniz!",
                        type: "email",
                        message: t("addCustomer.contact_email_message"),
                      },
                    ]}
                  >
                    <Input
                    data-test="contactmail"
                      placeholder={t("addCustomer.contact_email_placeholder")}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </Form.Item>
                </div>
                <div className="grid sm:grid-cols-2  gap-4">
                  <Form.Item
                    label={t("addCustomer.contact_phone_label")}
                    name="contactPhoneNumber"
                    rules={[
                      {
                        required: true,
                        type: number,
                        message: t("addCustomer.contact_phone_message"),
                        validator: (_, value) => {
                          if (
                            value &&
                            !isPhoneValid(value) &&
                            value.length > 3
                          ) {
                            return Promise.reject(
                              t("addCustomer.company_name_label")
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
                      inputProps={{
                        'data-test': 'phone'
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                  
                    label={t("addCustomer.country_label")}
                    name="country"
                    rules={[
                      {
                        required: true,
                        message: t("addCustomer.country_message"),
                      },
                    ]}
                  >
                    <Select
                     data-test="country"
                      showSearch
                      style={{ width: "100%" }}
                      value={country ? country.isoCode : undefined}
                      placeholder={t("addCustomer.country_placeholder")}
                      optionFilterProp="children"
                      onChange={handleCountryChange}
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {countryData.map((country, index) => (
                        <Option key={index} value={country.isoCode}>
                          {t(`countries.${country.isoCode}`, country.name)}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Form.Item
                    label={t("addCustomer.city_label")}
                    name=" "
                    rules={[
                      {
                        required: true,
                        message: t("addCustomer.city_message"),
                      },
                    ]}
                  >
                    <Select
                     data-test="city"
                      showSearch
                      style={{ width: "100%" }}
                      value={state ? state.isoCode : undefined}
                      placeholder={t("addCustomer.city_placeholder")}
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
                          <Option key={index} value={state.name}>
                            {state.name}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label={t("addCustomer.county_label")}
                    name="ilce"
                    rules={[
                      {

                        message: t("addCustomer.county_message"),
                      },
                    ]}
                  >
                    <Select
                    data-test="county"
                      showSearch
                      style={{ width: "100%" }}
                      value={county ? county.name : null}
                      placeholder={t("addCustomer.county_placeholder")}
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
                  label={t("addCustomer.address_label")}
                  name="address"
                  rules={[
                    {
                      required: true,
                      message: t("addCustomer.address_message"),
                    },
                  ]}
                >
                  <Input.TextArea
                  data-test="address"
                    placeholder={t("addCustomer.address_placeholder")}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                  data-test="addCustomer"
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold  px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    {t("addCustomer.save_button")}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompanyForm;
