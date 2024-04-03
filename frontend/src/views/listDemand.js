import React, { useState, useEffect } from "react";
import axios from "axios";
import showNotification from "../utils/showNotification";
import { fetchData } from "../utils/fetchData";
import { login } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AreUSure from "../components/areUSure";
import filterFunction from "../utils/globalSearchFunction";
import SearchInput from "../components/searchInput";
import MailConfirmModal from "../components/mailConfirmmodal";
import Notification from "../utils/notification";
import Highlighter from "react-highlight-words";
import { normalize } from "react-highlight-words";
import ListComponent from "../components/listComponent";
import Loading from "../components/loadingComponent";

const ListDemand = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [demands, setDemands] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedDemandIndex, setSelectedDemandIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalEmail, setModalEmail] = useState("");
  const { user } = useSelector((state) => state.auth);

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

  const handleOpenModal = (email) => {
    setModalEmail(email);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
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

  const handleConfirmApprove = async (demand) => {
    setSelectedDemandIndex(demand);
    setConfirmModalOpen(true);

    console.log("Talep onaylandı:", demand.companyId);
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
        setTimeout(() => {}, 2000);
        setConfirmModalOpen(false);
        try {
          await axios.delete(
            `${process.env.REACT_APP_API_URL}/api/demands/${demand.id}`
          );
          fetchDemands();
        } catch (error) {
          console.log("errrror silinmedi kamil" + error);
        }
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/sendemail`,
            {
              recipientEmail: demand.aemail,
            }
          );
        } catch (error) {}
      }
      Notification("success", "Talep başarılı bir şekilde onaylandı.");
    } catch (error) {
      Notification("error", "Talep onaylanırken bir hata oluştu.");
      console.error("Talep onaylanırken bir hata oluştu:", error);
    }
  };

  const handleDeleteDemand = async (demandId) => {
    console.log("Talep silindi:", demandId);
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/demands/${demandId}`
      );
      Notification("success", "Talep başarılı bir şekilde silinmiştir.");
      setTimeout(() => {}, 2000);
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
      title: "Şirket Adı",
      dataIndex: "companyname",
      key: "companyname",
      sorter: (a, b) => a.companyname.localeCompare(b.companyname),
    },
    {
      title: "İsim",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Soyisim",
      dataIndex: "surname",
      key: "surname",
    },
    {
      title: "Telefon",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
    },
  ];

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

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <ListComponent
          handleAdd={false}
          handleUpdate={false}
          handleApprove={handleConfirmApprove}
          handleDelete={handleDeleteDemand}
          handleDetail={false}
          columns={columns}
          data={data}
          name={"Talep Listesi"}
        />
      )}
    </>
  );
};

export default ListDemand;
