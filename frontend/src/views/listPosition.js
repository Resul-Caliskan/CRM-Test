import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Notification from "../utils/notification";
import { FaTimes, FaInfoCircle, FaEdit } from "react-icons/fa";
import { IoAddCircleSharp } from "react-icons/io5";
import AreUSure from "../components/areUSure";
import { getIdFromToken } from "../utils/getIdFromToken";

const ListPosition = () => {
  const navigate = useNavigate();
  const [positions, setPositions] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;
  const companyId = getIdFromToken(localStorage.getItem("token"));

  useEffect(() => {
    fetchPositions();
  }, []);

  const handleAddPosition = () => {
    navigate("/addposition");
  };

  const fetchPositions = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/positions/get/${companyId}`
      );
      setPositions(response.data);
    } catch (error) {
      console.error("Customers fetching failed:", error);
    }
  };

  const handleDeletePosition = async (positionId) => {
    console.log("Talep silindi:", positionId);
    try {
      await axios.delete(`${apiUrl}/api/positions/${positionId}`);
      Notification(true, "Başarıyla silindi");
      fetchPositions();
    } catch (error) {
      console.error("Pozisyon silinirken bir hata oluştu:", error);
      Notification(false, "Pozisyon silinirken bir hata oluştu!");
    } finally {
      setDeleteConfirmation(null);
    }
  };

  const showDeleteConfirmationModal = (positionId) => {
    setDeleteConfirmation(positionId);
  };

  const hideDeleteConfirmationModal = () => {
    setDeleteConfirmation(null);
  };

  const handleEditPosition = (positionId) => {
    navigate(/edit-position/${positionId});
  };

  const handlePositionDetails = (positionId) => {
    if (positionId) {
      navigate(/position-detail/${positionId});
    } else {
      console.error(
        "Pozisyon detayları alınamadı: Pozisyon bilgileri eksik veya geçersiz."
      );
    }
  };

  return (
    <div className="flex-col mx-auto px-4 py-8 flex justify-center">
      <h2 className="text-center font-semibold text-xl mb-6">
        Talep Edilen Pozisyonlarım
      </h2>
      <button
        className="bg-green-500 mx-10 mb-3 hover:bg-green-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
        onClick={handleAddPosition}
      >
        Yeni Talep Oluştur{" "}
        <IoAddCircleSharp
          className="inline-block ml-3"
          style={{ fontSize: "24px" }}
        />
      </button>
      <div className="overflow-xauto px-10">
        <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {positions.map((position) => (
            <div
              key={position.id}
              className="bg-gray-100 p-4 hover:bg-gray-200 rounded border shadow"
            >
              <h3 className="font-semibold text-xl text-center mb-2 border-b border-gray-300 pb-2">
                {position.jobtitle}
              </h3>
              <div className="flex flex-col text-lg text-gray-600 overflow-y-auto">
                <p>
                  <strong>Departman:</strong> {position.department}
                </p>
                <p>
                  <strong>Deneyim Süresi:</strong> {position.experienceperiod}
                </p>
                <p>
                  <strong>İşyeri Politikası:</strong> {position.modeofoperation}
                </p>
                <p>
                  <strong>İş Türü:</strong> {position.worktype}
                </p>
                <div style={{ maxHeight: "100px" }}>
                  <p>
                    <strong>İş Tanımı:</strong> {position.description}
                  </p>
                </div>
              </div>
              <div class="mt-4 flex justify-between items-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold lg:py-2 lg:px-3 md:py-1 md:px-2 min-[320px]:px-2 min-[320px]:py-1 rounded focus:outline-none focus:shadow-outline flex items-center"
                  onClick={() => handlePositionDetails(position._id)}
                >
                  Detaylar <FaInfoCircle className="inline-block ml-1" />
                </button>
                <button
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold  lg:py-2 lg:px-3 md:py-1 md:px-2 min-[320px]:px-2 min-[320px]:py-1 rounded focus:outline-none focus:shadow-outline flex items-center"
                  onClick={() => handleEditPosition(position._id)}
                >
                  Düzenle <FaEdit className="inline-block ml-1" />
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold  lg:py-2 lg:px-3 md:py-1 md:px-2 min-[320px]:px-2 min-[320px]:py-1 rounded focus:outline-none focus:shadow-outline flex items-center"
                  onClick={() => showDeleteConfirmationModal(position._id)}
                >
                  Sil <FaTimes className="inline-block ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AreUSure
        isOpen={deleteConfirmation !== null}
        onClose={() => setDeleteConfirmation(null)}
        onConfirm={() => handleDeletePosition(deleteConfirmation)}
      >
        <p>Pozisyonu Silmek İstediğinize Emin Misiniz? </p>
      </AreUSure>
    </div>
  );
};

export default ListPosition;
