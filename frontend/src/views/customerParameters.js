import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { getIdFromToken } from "../utils/getIdFromToken";
import { Button, Popconfirm } from "antd";
import Loading from "../components/loadingComponent";
import Notification from "../utils/notification";
import { useTranslation } from "react-i18next";
const CustomerParameters = () => {
  const { t } = useTranslation();
  const [industries, setIndustries] = useState([]);
  const [newIndustry, setNewIndustry] = useState("");
  const [companies, setCompanies] = useState([]);
  const [newCompany, setNewCompany] = useState("");

  const [editedIndustry, setEditedIndustry] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const customerId = getIdFromToken(localStorage.getItem("token"));
  const apiUrl = process.env.REACT_APP_API_URL;
  useEffect(() => {
    fetchIndustries();
    fetchCompanies();
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

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/customers/get-companies/${customerId}`
      );
      setCompanies(response.data.companies);
    } catch (error) {
      console.error("Error fetching companies:", error);
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
      await axios.put(
        `${apiUrl}/api/customers/delete-industry/${customerId}`,
        {}
      );
      fetchIndustries();
      setEditedIndustry("");
      setIsEditing(false);
      setEditIndex(null);
    } catch (error) {
      console.error("Error editing industry:", error);
    }
  };

  const addCompany = async () => {
    try {
      await axios.put(`${apiUrl}/api/customers/add-company/${customerId}`, {
        company: newCompany,
      });
      fetchCompanies();
      setNewCompany("");
    } catch (error) {
      console.error("Error adding company:", error);
    }
  };

  const deleteCompany = async (companyToDelete) => {
    try {
      await axios.put(`${apiUrl}/api/customers/delete-company/${customerId}`, {
        company: companyToDelete,
      });
      fetchCompanies();
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Sektörler */}
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
              <Button onClick={editIndustry} >
                {t("addCustomer.save_button")}
              </Button>
            </div>
          ) : (
            <div>
              <p>{industry}</p>
              <div className="flex justify-between mt-2">
                <Popconfirm
                  title={t("listCustomer.delete_record_message")}
                  onConfirm={() => deleteIndustry(industry)}
                  okText={t("parameters.pop-up.ok_message")}
                  cancelText={t("parameters.pop-up.cancel_message")}
                  okType="danger"
                >
                  <Button type="danger">{t("delete")}</Button>
                </Popconfirm>
                <FaEdit
                  onClick={() => {
                    setIsEditing(true);
                    setEditIndex(index);
                    setEditedIndustry(industry);
                  }}
                  className="cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      ))}
      {/* Yeni sektör ekleme */}
      <div className="bg-white p-4 rounded border shadow">
        <input
          type="text"
          value={newIndustry}
          onChange={(e) => setNewIndustry(e.target.value)}
          className="border rounded py-1 px-2 mr-2"
        />
        <Button onClick={addIndustry}>{t("addCustomer.add_sector")}</Button>
      </div>

      {/* Şirketler */}
      {companies.map((company, index) => (
        <div key={index} className="bg-white p-4 rounded border shadow">
          <p>{company}</p>
          <div className="flex justify-between mt-2">
            <Popconfirm
              title="Şirketi Silmek İstediğinize Emin Misiniz?"
              onConfirm={() => deleteCompany(company)}
              okText="Evet"
              cancelText="Hayır"
              okType="danger"
            >
              <Button type="danger">{t("delete")}</Button>
            </Popconfirm>
          </div>
        </div>
      ))}
      {/* Yeni şirket ekleme */}
      <div className="bg-white p-4 rounded border shadow">
        <input
          type="text"
          value={newCompany}
          onChange={(e) => setNewCompany(e.target.value)}
          className="border rounded py-1 px-2 mr-2"
        />
        <Button onClick={addCompany}>{t("addCustomer.add_company")}</Button>
      </div>
    </div>
  );
};

export default CustomerParameters;
