import { Button, Dropdown, Form, Input, Space } from "antd";
import { number } from "prop-types";
import { useEffect, useState } from "react";
import { PhoneInput } from "react-international-phone";
import { isPhoneValid } from "../../views/addUser";
import { useSelector } from "react-redux";
import axios from "axios";
import Notification from "../../utils/notification";
import { useTranslation } from "react-i18next";
import { DownOutlined } from "@ant-design/icons";
import { GrLanguage } from "react-icons/gr";
export default function UserInfo() {
  const { user } = useSelector((state) => state.auth);
  const [form] = Form.useForm();
  const [phone, setPhone] = useState("");
  const [isActive, setIsACtive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState();
  const { t, i18n } = useTranslation();
  const [selectedItem, setSelectedItem] = useState("Türkçe");
  const handleButtonClick = () => {
    setIsACtive(!isActive);
  };
  const fetchUserInfo = async () => {
    console.log(user.id);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/user/${user.id}`
      );
      const data = response.data;
      setUserInfo(data);
      console.log(response.data)

      form.setFieldsValue(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchUserInfo();
  }, []);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      getLanguageCookie();
      setInitialized(true);
    }
  }, [initialized]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.cookie = `i18next=${lng}; path=/`;
  };
  const getLanguageCookie = () => {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split("=");

      if (name === "i18next") {
        if(value === "en")
          setSelectedItem("English");
        else
          setSelectedItem("Türkçe");
      }
    }
  };
  const handleLanguageSelect = (language) => {
    setSelectedItem(language);
    if (language === "Türkçe") {
      changeLanguage("tr");
    } else {
      changeLanguage("en");
    }
  };
  const handleSubmit = async (values) => {
    setLoading(true);
    console.log(values.name);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/user/${user.id}`,
        {
          name: values.name,
          surname: values.surname,
          phone: values.phone,
          email: values.email,
        }
      );
      Notification("success", t("profile.warnings.successfully"));
      setLoading(false);
      fetchUserInfo();
    } catch (error) {
      console.error('t("profile.warnings.error")', error);
      setLoading(false);
    }
  };
  const items = [
    {
      key: '1',
      label: (
        <a onClick={() => handleLanguageSelect("Türkçe")}>

          Türkçe
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a onClick={() => handleLanguageSelect("English")}>
          English
        </a>
      ),
    }
  ];
  return (
    <div className="pt-3 px-5 flex flex-col w-full   mt-2   ">
      <div className="flex relative flex-row justify-start  items-center gap-7 ml-4  ">
        <div className="flex  items-center justify-center   rounded-full bg-[#E6F4FF] text-5xl h-[100px] w-[100px] text-gray-900">
          {userInfo?.name[0]}{userInfo?.surname[0]}
        </div>
        <div className="flex flex-col ">
          <h2 className="text-gray-900 text-lg">
            {userInfo?.name} {userInfo?.surname}
          </h2>
          <h3 className="text-sm text-gray-400">
            {user.company.companyname},{user.role}{" "}
          </h3>
        </div>
        <div className="absolute -bottom-5 right-16 sm:right-0 sm:top-7  ">
          <Dropdown
            menu={{
              items,
            }}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space className="flex justify-center items-center">
                <GrLanguage className="text-blue-500" />
                <p className="text-blue-500">{selectedItem}</p>
                <DownOutlined className="text-blue-500 pt-1.5 " />
              </Space>
            </a>
          </Dropdown>
        </div>
      </div>

      <div>
        <Form
          layout="vertical"
          className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full mt-5 items-center  p-5  mb-5"
          initialValues={userInfo}
          form={form}
          onFinish={handleSubmit}
        >
          <Form.Item
            label={t("profile.labels.name")}
            name="name"
            className=" col-span-1"
            required
          >
            <Input  placeholder={t("profile.labels.name")} className=" h-9" />
          </Form.Item>
          <Form.Item
            label={t("profile.labels.surname")}
            name="surname"
            className=" col-span-1"
            required
          >
            <Input
              placeholder={t("profile.labels.surname")}
              className=" h-9 "
            />
          </Form.Item>

          <Form.Item
            label={t("profile.labels.email")}
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: t("profile.messages.email"),
              },
            ]}
          >
            <Input placeholder={t("profile.labels.email")} className=" h-9" />
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
              className="h-9 w-full"
              defaultCountry="tr"
              value={phone}
              onChange={(phone) => setPhone(phone)}
            />
          </Form.Item>
          <Form.Item className=" w-full md:col-span-2">
            <Button
              className="border w-full  bg-indigo-600 hover:bg-indigo-500 text-white flex justify-center"
              type="primary"
              loading={loading}
              htmlType="submit"
            >
              Kaydet
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
