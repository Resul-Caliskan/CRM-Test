import { useState, useEffect } from 'react';
import { Form, Input, Button, Select } from 'antd';
import axios from 'axios';
import { fetchData } from '../utils/fetchData';
import { login } from '../redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
const { Option } = Select;

const UserForm = ({ handleSubmit, loading }) => {
  const [roles, setRoles] = useState([]);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
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

    fetchRolesFromDatabase();

    
    //console.log("USEEFFECUYSGABFH"+roles);
  }, []);
    
    

   

  const  fetchRolesFromDatabase = async () => {
     await axios.get(`${process.env.REACT_APP_API_URL}/api/role`)
      .then(response => {
        
        setRoles(response.data);
     
        console.log(response.data);
      })
      .catch(error => {
        console.error('Roles fetching failed:', error);
      });
  };
  
  const handleFormSubmit = async (values) => {
    try {
      const formData = {
        email: values.email,
        password: values.password,
        role: values.role
      };

      // POST isteği yap
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/customers/add/65def679b02acc1faeaf52d1`, formData);

      if (response.status === 200) {
        console.log("Kullanıcı başarıyla eklendi!");
      } else {
        console.error("Kullanıcı eklenirken bir hata oluştu!");
        console.error(formData);
      }
    } catch (error) {
      console.error("İstek yapılırken bir hata oluştu:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md">
        <h2 className="text-center text-2xl mb-6">Kullanıcı Ekle</h2>
        <Form
          form={form}
          onFinish={handleFormSubmit}
          layout="vertical"
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: 'email', message: 'Geçerli bir email adresi giriniz!' }]}
          >
            <Input
              placeholder="Email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Lütfen şifrenizi giriniz!' }]}
          >
            <Input.Password
              placeholder="Password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </Form.Item>
          <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Lütfen bir rol seçiniz!' }]}>
            <Select
              placeholder="Rol Seçiniz"

            >
              {roles && roles.length>0?(roles.map((role) => (
                <Option key={role._id} value={role.role}>
                  {role.role}
                </Option>
              ))):null}
              
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="border w-full my-8  bg-indigo-600 hover:bg-indigo-500 text-white flex justify-center"
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

export default UserForm;
