import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Button, Select } from "antd";
import showNotification from '../utils/showNotification';
import Notification from '../utils/notification';
import { FaTimes, FaInfoCircle, FaEdit } from 'react-icons/fa';
const { Option } = Select;

const Parameters = () => {
  const [parameters, setParameters] = useState([]);
  const [editingParameter, setEditingParameter] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  // API'den parametreleri almak için bir mock API çağrısı
  useEffect(() => {
   fetchPositions();
    
  }, []);


  const fetchPositions = async () => {
    try {
        const response = await axios.get(`${apiUrl}/api/parameters`);
        setParameters(response.data);
        console.log("PARAMETRELER "+parameters[0].title);
    } catch (error) {
        console.error('Parameter fetching failed:', error);
    }
};
  const handleEditClick = (parameter) => {
    setEditingParameter(parameter);
  };

  const handleSaveClick = () => {
    
    console.log('Parametre kaydedildi:', editingParameter);
    setEditingParameter(null);
  };

  return (
    <div>
      <h1 className='text-center my-5 font-semibold '>API Parametreleri</h1>
      <div>
        
      <ul className='grid grid-cols-4 gap-4 '>
        {parameters.map((param) => (
          <div key={param.title} className="bg-white p-4 rounded border shadow">
          <h3 className="font-semibold text-lg text-center mb-2 border-b border-gray-200 pb-2">{param.title}</h3>
          <div class="flex flex-col">
              <p><strong>Parametre Başlığı:</strong> {param.title}</p>
              <p><strong>Parametre Değerleri:</strong></p>

              <Select placeholder={param.title+" seç"}>
              {parameters.map((parameter, index) => {
                if (parameter.title === param.title) {
                  return parameter.values.map((value, idx) => (
                    <Option key={`${parameter._id}-${idx}`} value={value}>
                      {value}
                    </Option>
                  ));
                }
                return null;
              })}
            </Select>
              
          </div>
          {/* <div class="mt-4 flex justify-between items-center">
              <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => handlePositionDetails(position)}
              >
                  Detaylar <FaInfoCircle className="inline-block ml-1" />
              </button>
              <button
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => handleEditPosition(position._id)}
              >
                  Düzenle <FaEdit className="inline-block ml-1" />
              </button>
              <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => handleDeletePosition(position._id)}
              >
                  Sil <FaTimes className="inline-block ml-1" />
              </button>

          </div> */}
      </div>
        ))}
      </ul>
      </div>
      <button>Parametre Ekle</button>
    </div>
  );
};




export default Parameters;