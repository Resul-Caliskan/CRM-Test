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
import { highlightSearchTerm } from "../utils/highLightSearchTerm";
import { setSelectedOption } from "../redux/selectedOptionSlice";

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
        setConfirmModalOpen(false);
        Notification("success", "Talep başarılı bir şekilde onaylandı.");
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
    console.log("Talep silindi:", demandId);
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
      title: "Şirket Adı",
      dataIndex: "companyname",
      key: "companyname",
      sorter: (a, b) => a.companyname.localeCompare(b.companyname),
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    {
      title: "İsim",
      dataIndex: "name",
      key: "name",
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    {
      title: "Soyisim",
      dataIndex: "surname",
      key: "surname",
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    {
      title: "Telefon",
      dataIndex: "number",
      key: "number",
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
  ];
  const filterDemands = (demands) => {
    if (!searchTerm) return demands;
    console.log("buraya geçti");
    return demands.filter((demand) => {
      const {
        name,
        surname,
        number,
        email,
        password,
        companyId,
        companyname,
      } = demand;
 
      if (!name || !surname || !number || !email  || !companyId || !companyname) return false;
      console.log("filtreledi");
 
     
 
      return (
        console.log("filtreledi"),
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
          handleAdd={false}
          handleUpdate={false}
          handleApprove={handleConfirmApprove}
          handleDelete={handleDeleteDemand}
          handleDetail={false}
          columns={columns}
          data={filterDemands(data)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          name={"Talep Listesi"}
        />
      )}
    </>
  );
};

export default ListDemand;
