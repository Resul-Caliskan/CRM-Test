// import { useState, useEffect } from 'react';
// import { Form, Input, Button, Select } from 'antd';
// import axios from 'axios';
// import { fetchData } from '../utils/fetchData';
// import { login } from '../redux/authSlice';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom'
// const { Option } = Select;

// const UserForm = ({ handleSubmit, loading }) => {
//   const [roles, setRoles] = useState([]);
//   const [form] = Form.useForm();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user } = useSelector((state) => state.auth);
//   useEffect(() => {

//     if (!user || user.role === null) {
//       console.log("girdi");
//       fetchData().then(data => {
//         console.log("cevap:", data);
//         dispatch(login(data.user));
//         if (data.user.role !== 'admin') {
//           navigate('/forbidden');
//         }
//       }).catch(error => {
//         console.error(error);
//       });
//     }

//     fetchRolesFromDatabase();

    
//     //console.log("USEEFFECUYSGABFH"+roles);
//   }, []);
    
    

   

//   const  fetchRolesFromDatabase = async () => {
//      await axios.get(`${process.env.REACT_APP_API_URL}/api/role`)
//       .then(response => {
        
//         setRoles(response.data);
     
//         console.log(response.data);
//       })
//       .catch(error => {
//         console.error('Roles fetching failed:', error);
//       });
//   };
  
//   const handleFormSubmit = async (values) => {
//     try {
//       const formData = {
//         email: values.email,
//         password: values.password,
//         role: values.role
//       };

//       // POST isteği yap
//       const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/customers/add/65def679b02acc1faeaf52d1`, formData);

//       if (response.status === 200) {
//         console.log("Kullanıcı başarıyla eklendi!");
//       } else {
//         console.error("Kullanıcı eklenirken bir hata oluştu!");
//         console.error(formData);
//       }
//     } catch (error) {
//       console.error("İstek yapılırken bir hata oluştu:", error);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="w-full max-w-md">
//         <h2 className="text-center text-2xl mb-6">Kullanıcı Ekle</h2>
//         <Form
//           form={form}
//           onFinish={handleFormSubmit}
//           layout="vertical"
//           className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
//         >
//           <Form.Item
//             label="Email"
//             name="email"
//             rules={[{ required: true, type: 'email', message: 'Geçerli bir email adresi giriniz!' }]}
//           >
//             <Input
//               placeholder="Email"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </Form.Item>
//           <Form.Item
//             label="Password"
//             name="password"
//             rules={[{ required: true, message: 'Lütfen şifrenizi giriniz!' }]}
//           >
//             <Input.Password
//               placeholder="Password"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </Form.Item>
//           <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Lütfen bir rol seçiniz!' }]}>
//             <Select
//               placeholder="Rol Seçiniz"

//             >
//               {roles && roles.length>0?(roles.map((role) => (
//                 <Option key={role._id} value={role.role}>
//                   {role.role}
//                 </Option>
//               ))):null}
              
//             </Select>
//           </Form.Item>
//           <Form.Item>
//             <Button
//               type="primary"
//               htmlType="submit"
//               loading={loading}
//               className="border w-full my-8  bg-indigo-600 hover:bg-indigo-500 text-white flex justify-center"
//               style={{ borderRadius: '0.375rem' }}
//             >
//               Kaydet
//             </Button>
//           </Form.Item>
//         </Form>
//       </div>
//     </div>
//   );
// };

// export default UserForm;
import { useState, useEffect } from "react";
import { Form, Input, Button, Select } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PhoneNumberUtil } from "google-libphonenumber";
import { PhoneInput } from "react-international-phone";
import { number } from "prop-types";
import Notification from "../utils/notification";
import { setSelectedOption } from "../redux/selectedOptionSlice";
import { setUserSelectedOption } from "../redux/userSelectedOptionSlice";
import { useDispatch, useSelector } from "react-redux";

const { Option } = Select;
const phoneUtil = PhoneNumberUtil.getInstance();
const isPhoneValid = (phone) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};

const UserForm = () => {
  const [form] = Form.useForm();
  const[loading,setLoading]=useState(false);
  const [companies, setCompanies] = useState([]);
  const [phone, setPhone] = useState("");
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
    await axios
      .get(`${process.env.REACT_APP_API_URL}/api/customers`)
      .then((response) => {
        console.log(response);
        setCompanies(response.data);
      })
      .catch((error) => {
        console.error("Roles fetching failed:", error);
      });
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = {
        companyName: values.companyName,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
      };
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/customers/add/${
          companies[formData.companyName]._id
        }`,
        {
          email: formData.email,
          password: "şifre",
          role: "user",
        }
      );
      if (response.status === 200) {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/sendemail`,
            {
              recipientEmail: formData.email,
              name: formData.firstName,
              surname: formData.lastName,
            }
          );
        } catch (error) {
            Notification("error", "Kullanıcıya mail gönderilirken bir hata oluştu");
          console.log("errrror mail gönderilemedi" + error);
        }
      }
      //   const response = await axios.post(
      //     `${process.env.REACT_APP_API_URL}/api/demand`,
      //     {
      //       name: formData.firstName,
      //       surname: formData.lastName,
      //       number: formData.phone,
      //       email: formData.email,
      //       companyname: companies[formData.companyName].companyname,
      //       companyId: companies[formData.companyName]._id,
      //     }
      //   );
      Notification(
        "success",
        "Kullanıcı Başarıyla Eklendi.",
        "Kullanıcıya Mail Gönderildi"
      );
      setTimeout(() => {
        setLoading(false);
        dispatch(setSelectedOption("list-demands"));
      }, 1000);

      form.resetFields();
    } catch (error) {
        setLoading(false)
      console.error("İstek yapılırken bir hata oluştu:", error);
      Notification("error", "Kullanıcı eklenirken hata oluştu");
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md mt-12">
        <h2 className="text-center text-2xl mb-6">Kullanıcı Ekle</h2>
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
            rules={[
              { required: true, message: "Lütfen şirket adını seçiniz!" },
            ]}
          >
            <Select placeholder="Şirket Seç">
              {companies.map((company, index) => (
                <Option key={company._id} value={index}>
                  {company.companyname}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="İsim"
            name="firstName"
            rules={[{ required: true, message: "Lütfen isminizi giriniz!" }]}
          >
            <Input placeholder="İsim" />
          </Form.Item>
          <Form.Item
            label="Soyisim"
            name="lastName"
            rules={[{ required: true, message: "Lütfen soyisminizi giriniz!" }]}
          >
            <Input placeholder="Soyisim" />
          </Form.Item>
          <Form.Item
            label="E-mail"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Lütfen geçerli bir e-mail adresi giriniz!",
              },
            ]}
          >
            <Input placeholder="E-mail" />
          </Form.Item>
          <Form.Item
            label="İlgili Kişi Telefon numarası"
            name="phone"
            rules={[
              {
                required: true,
                type: number,
                message: "Geçerli bir telefon numarası giriniz.",
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
              className=""
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
              style={{ borderRadius: "0.375rem" }}
              loading={loading}
            >
              Kaydet
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default UserForm;

