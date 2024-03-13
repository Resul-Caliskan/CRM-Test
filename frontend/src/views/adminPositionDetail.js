import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {useNavigate, useParams } from 'react-router-dom';
import { FaInfoCircle } from 'react-icons/fa';
import NomineeDetail from '../components/nomineeDetail';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../utils/fetchData';
import { login } from '../redux/authSlice';

const AdminPositionDetail = () => {

  const [nominees, setNominees] = useState([]);
  const [suggestedNominees, setSuggestedNominees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isNomineeDetailOpen, setIsNomineeDetailOpen] = useState(false);
  const [nomineeDetail, setNomineeDetail] = useState();
  const [isKnown, setIsKnown] = useState(true);
  const [position, setPosition] = useState(null);
  const { id } = useParams();
 
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const openNomineeDetail = () => {
    setIsNomineeDetailOpen(true);
  };

  const closeNomineeDetail = () => {
    setIsNomineeDetailOpen(false);
  };
  const navigate = useNavigate();
  useEffect(() => {
    
    if (!user || user.role === null) {
      
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

    
    getPositionById(id);
    fetchNominees();
    
    
  }, [])

  const fetchNominees = async () => {
    setLoading(false);
    try {
   
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/nominee/pozisyon-admin`, { positionId:id })
      
      const nominees = response.data.sharedNominees;
      const suggested = response.data.allCv;
      setNominees(nominees);
      setSuggestedNominees(suggested);
      setLoading(false);
    } catch (error) {
      setError(error.message);
    }
    
  }
  const getPositionById = async (id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/positions/${id}`);
      setPosition(response.data);
      return response.data;
    } catch (error) {
      console.error("Pozisyon alınırken bir hata oluştu:", error);
      return null;
    }
  };
  const handleNomineeDetail = (nominee, isKnown) => {
    if (nominee && nominee._id) {
      setIsKnown(isKnown);
      setNomineeDetail(nominee);
      openNomineeDetail();
    } else {
      console.error("Pozisyon detayları alınamadı: Pozisyon bilgileri eksik veya geçersiz.");
    }
  };
  return (
    <div div className="flex-col mx-auto px-4 py-8 ">
      <h2 className="text-center font-semibold text-xl mb-6 border-b border-gray-200 pb-2">{position && position.positionname} Detayı</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          {position && (
            <div className="bg-white p-4 rounded border shadow">
              <div className="font-semibold text-lg text-center mb-2 border-b border-gray-200 pb-2">Pozisyon Detayı</div>
              <div className="flex flex-col">
                <p><strong>Departman:</strong> {position.department}</p>
                <p><strong>Pozisyon Seviyesi:</strong> {position.jobtitle}</p>
                <p><strong>Deneyim Süresi:</strong> {position.experienceperiod}</p>
                <p><strong>İşyeri Politikası:</strong> {position.modeofoperation}</p>
                <p><strong>İş Türü:</strong> {position.worktype}</p>
                <p><strong>İş Tanımı:</strong> {position.description}</p>
              </div>
            </div>
          )}
        </div>
        <div className="col-span-1 ">
          <div className="bg-white p-4 rounded border shadow">
            <h3 className="font-semibold text-lg text-center mb-4 border-b border-gray-200 pb-2">Adaylar</h3>
            {loading && <p>Veriler yükleniyor...</p>}
            {error && <p>Hata: {error}</p>}
            {nominees.map((nominee, index) => (
              <div key={index} className="bg-gray-100 hover:bg-gray-200 p-4 rounded border shadow mb-4 relative">
                <h4 className="font-semibold text-lg mb-2 ">{nominee.name}</h4>
                <p><strong>Unvan:</strong> {nominee.title}</p>
                {nominee.education.map((edu, index) => (
                  <ul>
                    <li key={index}>
                      <div><strong>Degree:</strong> {edu.degree}</div>
                    </li>
                  </ul>
                ))}
                <strong>Skills:</strong>
                <ul className="list-disc ml-4">
                  {nominee.skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
                <button className="absolute right-4 bottom-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center"
                  onClick={() => handleNomineeDetail(nominee, true)}

                >
                  Detaylar <FaInfoCircle className="ml-2 size-4" />
                </button>

              </div>
            ))}
          </div>
        </div>
        <div className="col-span-1">
          <div className="bg-white p-4 rounded border shadow">
            <h3 className="font-semibold text-lg text-center mb-4 border-b border-gray-200 pb-2">Önerilen Adaylar</h3>
            {loading && <p>Veriler yükleniyor...</p>}
            {error && <p>Hata: {error}</p>}
            {suggestedNominees.map((nominee, index) => (
              <div key={index} className="bg-gray-100 hover:bg-gray-200 p-4 rounded border shadow mb-4 relative">
                <h4 className="font-semibold text-lg mb-2">{nominee.name}</h4>
                <p><strong>Unvan:</strong> {nominee.title}</p>
                {nominee.education.map((edu, index) => (
                  <ul>
                    <li key={index}>
                      <div><strong>Degree:</strong> {edu.degree}</div>
                    </li>
                  </ul>
                ))}
                <strong>Skills:</strong>
                <ul className="list-disc ml-4">
                  {nominee.skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
                <button className="absolute right-4 bottom-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center"
                  onClick={() => handleNomineeDetail(nominee, false)}
                >
                  Detaylar <FaInfoCircle className="ml-2 size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        {isNomineeDetailOpen && <NomineeDetail nominee={nomineeDetail} isKnown={true} onClose={closeNomineeDetail} />}
      </div>
    </div>
  );
};

export default AdminPositionDetail;
