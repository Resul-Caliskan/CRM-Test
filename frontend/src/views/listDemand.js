import React, { useState, useEffect, useTransition } from "react";
import axios from "axios";
import { fetchData } from "../utils/fetchData";
import { login } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import filterFunction from "../utils/globalSearchFunction";
import Notification from "../utils/notification";
import ListComponent from "../components/listComponent";
import Loading from "../components/loadingComponent";
import { highlightSearchTerm } from "../utils/highLightSearchTerm";
import { setSelectedOption } from "../redux/selectedOptionSlice";
import { useTranslation } from "react-i18next";

const ListDemand = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [demands, setDemands] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedDemandIndex, setSelectedDemandIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { i18n, t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const selectedOption = useSelector(
    (state) => state.selectedOption.selectedOption
  );

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

    fetchDemands();
  }, []);

  const fetchDemands = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/demand`
      );
      setDemands(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Talepler alınırken bir hata oluştu:", error);
    }
  };

  const handleAdd = () => {
    dispatch(setSelectedOption("add-user"));
  };
  const handleConfirmApprove = async (demand) => {
    setSelectedDemandIndex(demand);
    setConfirmModalOpen(true);

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/customers/add/${demand.companyId}`,
        {
          email: demand.email,
          password: demand.password,
          role: "user",
        }
      );
      if (response.status === 200) {
        setConfirmModalOpen(false);
        Notification("success", "Talep başarılı bir şekilde onaylandı.");
        try {
          await axios.delete(
            `${process.env.REACT_APP_API_URL}/api/demands/${demand.id}`
          );
          fetchDemands();
        } catch (error) {}
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/sendemail`,
            {
              recipientEmail: demand.email,
            }
          );
        } catch (error) {}
      }
    } catch (error) {
      Notification("error", "Talep onaylanırken bir hata oluştu.");
      console.error("Talep onaylanırken bir hata oluştu:", error);
    }
  };

  const handleDeleteDemand = async (demandId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/demands/${demandId}`
      );

      setTimeout(() => {
        Notification("success", "Talep başarılı bir şekilde silinmiştir.");
      }, 500);
      fetchDemands();
    } catch (error) {
      Notification("error", "Talep silinirken bir hata oluştu.");
      console.error("Talep silinirken bir hata oluştu:", error);
    } finally {
      setDeleteConfirmation(null);
    }
  };
  const columns = [
    {
      title: () => t("userDemands.company_name"),
      dataIndex: "companyname",
      key: "companyname",
      sorter: (a, b) => a.companyname.localeCompare(b.companyname),
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    {
      title: () => t("userDemands.name"),
      dataIndex: "name",
      key: "name",
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    {
      title: () => t("userDemands.surname"),
      dataIndex: "surname",
      key: "surname",
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    {
      title: () => t("userDemands.phone"),
      dataIndex: "number",
      key: "number",
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    {
      title: () => t("userDemands.email"),
      dataIndex: "email",
      key: "email",
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
  ];
  const filterDemands = (demands) => {
    if (!searchTerm) return demands;
    return demands.filter((demand) => {
      const { name, surname, number, email, password, companyId, companyname } =
        demand;

      if (!name || !surname || !number || !email || !companyId || !companyname)
        return false;

      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        password.toLowerCase().includes(searchTerm.toLowerCase()) ||
        companyname.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };
  const data = demands.map((customer, index) => ({
    key: index,
    id: customer._id,
    name: customer.name,
    surname: customer.surname,
    number: customer.number,
    email: customer.email,
    password: customer.password,
    companyId: customer.companyId,
    companyname: customer.companyname,
  }));
  const filteredDemands = demands.filter((demand) => {
    const searchFields = ["name", "surname", "number", "email", "companyname"];
    return filterFunction(searchFields, demand, searchTerm);
  });

  const handleSearch = (value) => {
    setSearchTerm(value);
  };
  const handleAddDemad = () => {
    dispatch(setSelectedOption("add-demand"));
  };
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        
        <ListComponent
          handleAdd={handleAdd}
          handleUpdate={false}
          handleApprove={handleConfirmApprove}
          handleDelete={handleDeleteDemand}
          handleDetail={false}
          columns={columns}
          data={filterDemands(data)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          name={t("userDemands.page_name")}
        />
      )}
    </>
  );
};

export default ListDemand;
