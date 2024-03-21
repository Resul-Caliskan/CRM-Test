// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import showNotification from "../utils/showNotification";
// import Notification from "../utils/notification";
// import ApprovalModal from "../components/modal";
// import { fetchData } from "../utils/fetchData";
// import { login } from "../redux/authSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import filterFunction from "../utils/globalSearchFunction";
// import SearchInput from "../components/searchInput";
// const ListDemand = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [demands, setDemands] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalEmail, setModalEmail] = useState("");
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
//   const handleOpenModal = (email) => {
//     setModalEmail(email);
//     setIsModalOpen(true);
//   };
//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };
//   useEffect(() => {
//     if (!user || user.role === null) {
//       console.log("girdi");
//       fetchData()
//         .then((data) => {
//           console.log("cevap:", data);
//           dispatch(login(data.user));
//           if (data.user.role !== "admin") {
//             navigate("/forbidden");
//           }
//         })
//         .catch((error) => {
//           console.error(error);
//         });
//     }

//     fetchDemands();
//   }, [demands]);

//   const fetchDemands = async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/demand`);
//       if (response.status === 200) {
//         setDemands(response.data);
//       } else {
//         console.error("Talepler alınırken bir hata oluştu!");
//       }
//     } catch (error) {
//       console.error("İstek yapılırken bir hata oluştu:", error);
//     }
//   };
//   const handleApproveDemand = async (index) => {
//     console.log("Talep onaylandı:", demands[index].companyId);
//     try {
//       const response = await axios.put(
//         `${process.env.REACT_APP_API_URL}/api/customers/add/${demands[index].companyId}`,
//         {
//           email: demands[index].email,
//           password: demands[index].password,
//           role :"user",
//         }
//       );
//       if (response.status === 200) {
//         handleOpenModal(demands[index].email);
//       } else {
//         Notification(false, "Talep onaylanırken bir hata oluştu!");
//       }
//     } catch (error) {
//       console.error("Talep onaylanırken bir hata oluştu:", error);
//       Notification(false, "Talep onaylanırken bir hata oluştu!");
//     }
//   };

//   const handleDeleteDemand = async (index) => {
//     // Talebi silme işlemi
//     console.log("Talep silindi:", demands[index]);
//     try {
//       const response = await axios.delete(
//         `${process.env.REACT_APP_API_URL}/api/demands/${demands[index]._id}`,
//         {}
//       );
//       if (response.status === 200) {
//         showNotification(true, "Talep silindi.",'/adminhome');
//       } else {
//         showNotification(false, "Talep silinirken bir hata oluştu!");
//       }
//     } catch (error) {
//       console.error("Talep silinirken bir hata oluştu:", error);
//       Notification(false, "Talep silinirken bir hata oluştu!");
//     }
//   };

//   const filteredDemands = demands.filter((demand) => {
//     const searchFields = ["name", "surname","number", "email", "companyname"];

//     return filterFunction(searchFields, demand, searchTerm);
//   });
//   const handleSearch = (value) => {
//     setSearchTerm(value);
// };
//   return (
//     <div className="container mx-10 mt-12">
//       <div className="max-w-4xl mx-auto   ">
//       <SearchInput searchTerm={searchTerm} onSearch={handleSearch} />
//       </div>
//       <h2 className="text-center text-2xl mb-6">Talep Listesi</h2>
//       <div className="overflow-x-auto">
//         <table className="table-auto w-full border-collapse border border-gray-400">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="px-4 py-2">Şirket Adı</th>
//               <th className="px-4 py-2">Ad</th>
//               <th className="px-4 py-2">Soyad</th>
//               <th className="px-4 py-2">Email</th>
//               <th className="px-4 py-2">Telefon</th>
//               <th className="px-4 py-2">Onayla</th>
//               <th className="px-4 py-2">Sil</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredDemands.map((demand, index) => (
//               <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
//                 <td className="border px-4 py-2">{demand.companyname}</td>
//                 <td className="border px-4 py-2">{demand.name}</td>
//                 <td className="border px-4 py-2">{demand.surname}</td>
//                 <td className="border px-4 py-2">{demand.email}</td>
//                 <td className="border px-4 py-2">{demand.number}</td>
//                 <td className="border px-4 py-2">
//                   <button
//                     onClick={() => handleApproveDemand(index)}
//                     className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                   >
//                     Onayla
//                   </button>
//                 </td>
//                 <td className="border px-4 py-2">
//                   <button
//                     onClick={() => handleDeleteDemand(index)}
//                     className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                   >
//                     Sil
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       {isModalOpen && (
//         <ApprovalModal email={modalEmail} onClose={handleCloseModal} />
//       )}
//     </div>
//   );
// };

// export default ListDemand;
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

const ListDemand = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [demands, setDemands] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedDemandIndex, setSelectedDemandIndex] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
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

  const fetchDemands = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/demand`
      );
      setDemands(response.data);
    } catch (error) {
      console.error("Talepler alınırken bir hata oluştu:", error);
    }
  };

  const handleApproveDemand = async (index) => {
    console.log("Talep onaylandı:", demands[index].companyId);
    setSelectedDemandIndex(index);
    setConfirmModalOpen(true);
  };

  const handleConfirmApprove = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/customers/add/${demands[selectedDemandIndex].companyId}`,
        {
          email: demands[selectedDemandIndex].email,
          password: demands[selectedDemandIndex].password,
          role: "user",
        }
      );
      if (response.status === 200) {
        Notification(true, "Talebi Onayladınız ve Mail gönderdiniz.");
        setTimeout(() => {}, 2000);
        setConfirmModalOpen(false);
        try {
          await axios.delete(
            `${process.env.REACT_APP_API_URL}/api/demands/${demands[selectedDemandIndex]._id}`
          );
          fetchDemands();
        } catch (error) {
          console.log("errrror silinmedi kamil" + error);
        }
      }
    } catch (error) {
      console.error("Talep onaylanırken bir hata oluştu:", error);
      Notification("error", "Talep onaylanırken bir hata oluştu!");
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
      console.error("Talep silinirken bir hata oluştu:", error);
      Notification("error", "Talep silinirken bir hata oluştu!");
    } finally {
      setDeleteConfirmation(null);
    }
  };

  const showDeleteConfirmationModal = (demandId) => {
    setDeleteConfirmation(demandId);
  };

  const hideDeleteConfirmationModal = () => {
    setDeleteConfirmation(null);
  };

  const filteredDemands = demands.filter((demand) => {
    const searchFields = ["name", "surname", "number", "email", "companyname"];
    return filterFunction(searchFields, demand, searchTerm);
  });

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  return (
    <div className="container mx-10 mt-12 ">
      <div className="max-w-4xl mx-auto">
        <SearchInput searchTerm={searchTerm} onSearch={handleSearch} />
      </div>
      <h2 className="text-center text-2xl mb-6">Talep Listesi</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Şirket Adı</th>
              <th className="px-4 py-2">Ad</th>
              <th className="px-4 py-2">Soyad</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Telefon</th>
              <th className="px-4 py-2">Onayla</th>
              <th className="px-4 py-2">Sil</th>
            </tr>
          </thead>
          <tbody>
            {filteredDemands.map((demand, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                <td className="border px-4 py-2">{demand.companyname}</td>
                <td className="border px-4 py-2">{demand.name}</td>
                <td className="border px-4 py-2">{demand.surname}</td>
                <td className="border px-4 py-2">{demand.email}</td>
                <td className="border px-4 py-2">{demand.number}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleApproveDemand(index)}
                    className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-200/20 dark:shadow-lg dark:shadow-green-500/50 font-medium rounded-lg text-sm px-[32px] py-2.5 text-center mx-4"
                  >
                    Onayla
                  </button>
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => showDeleteConfirmationModal(demand._id)}
                    className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-200/20 dark:shadow-lg dark:shadow-red-500/50 font-medium rounded-lg text-sm px-[32px] py-2.5 text-center mx-4"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AreUSure
        isOpen={deleteConfirmation !== null}
        onClose={hideDeleteConfirmationModal}
        onConfirm={() => handleDeleteDemand(deleteConfirmation)}
      >
        <p>Talebi Silmek İstediğinize Emin Misiniz? </p>
      </AreUSure>
      {confirmModalOpen && (
        <MailConfirmModal
          email={demands[selectedDemandIndex].email}
          onClose={() => setConfirmModalOpen(false)}
          onConfirm={handleConfirmApprove} // Onaylama fonksiyonu burada geçiriliyor
        />
      )}
    </div>
  );
};

export default ListDemand;
