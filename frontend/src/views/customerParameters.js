import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { getIdFromToken } from "../utils/getIdFromToken";
import { Button, Popconfirm } from "antd";
import Loading from "../components/loadingComponent";
import Notification from "../utils/notification";

const CustomerParameters = () => {
  const [industries, setIndustries] = useState([]);
  const [newIndustry, setNewIndustry] = useState("");
  const [editedIndustry, setEditedIndustry] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const customerId = getIdFromToken(localStorage.getItem("token"));
  const apiUrl = process.env.REACT_APP_API_URL;
  useEffect(() => {
    fetchIndustries();
  }, []);

  const fetchIndustries = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/customers/get-industry/${customerId}`
      );
      setIndustries(response.data.industries);
    } catch (error) {
      console.error("Error fetching industries:", error);
    }
  };

  const addIndustry = async () => {
    try {
      await axios.put(`${apiUrl}/api/customers/add-industry/${customerId}`, {
        industry: newIndustry,
      });
      fetchIndustries();
      setNewIndustry("");
    } catch (error) {
      console.error("Error adding industry:", error);
    }
  };

  const deleteIndustry = async (industryToDelete) => {
    try {
      await axios.put(`${apiUrl}/api/customers/delete-industry/${customerId}`, {
        industry: industryToDelete,
      });
      fetchIndustries();
    } catch (error) {
      console.error("Error deleting industry:", error);
    }
  };

  const editIndustry = async () => {
    try {
      await axios.put(`${apiUrl}/api/customers/delete-industry/${customerId}`, {
       
      });
      fetchIndustries();
      setEditedIndustry("");
      setIsEditing(false);
      setEditIndex(null);
    } catch (error) {
      console.error("Error editing industry:", error);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {industries.map((industry, index) => (
        <div key={index} className="bg-white p-4 rounded border shadow">
          {isEditing && editIndex === index ? (
            <div className="flex items-center mb-2">
              <input
                type="text"
                value={editedIndustry}
                onChange={(e) => setEditedIndustry(e.target.value)}
                className="border rounded py-1 px-2 mr-2"
              />
              <Button onClick={editIndustry} type="primary">
                Save
              </Button>
            </div>
          ) : (
            <div>
              <p>{industry}</p>
              <div className="flex justify-between mt-2">
                <Popconfirm
                  title="Sektörü Silmek İstediğinize Emin Misiniz?"
                  onConfirm={() => deleteIndustry(industry)}
                  okText="Evet"
                  cancelText="Hayır"
                  okType="danger"
                >
                  <Button type="danger" className="bg-red-500 text-white">Sil</Button>
                </Popconfirm>
                {/* <Button
                  onClick={() => {
                    setIsEditing(true);
                    setEditIndex(index);
                    setEditedIndustry(industry);
                  }}
                >
                  Edit
                </Button> */}
              </div>
            </div>
          )}
        </div>
      ))}
      <div className="bg-white p-4 rounded border shadow">
        <input
          type="text"
          value={newIndustry}
          onChange={(e) => setNewIndustry(e.target.value)}
          className="border rounded py-1 px-2 mr-2"
        />
        <Button onClick={addIndustry}>Sektör Ekle</Button>
      </div>
    </div>
  );
};

export default CustomerParameters;
