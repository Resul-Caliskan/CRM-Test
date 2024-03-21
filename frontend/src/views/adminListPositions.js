
import React, { useState, useEffect } from "react";
import axios from "axios";
import filterFunction from "../utils/globalSearchFunction";
import SearchInput from '../components/searchInput';
import { useNavigate, useParams } from "react-router-dom";
const AdminListPosition = () => {
    const [positions, setPositions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    
    const [filters, setFilters] = useState({
        companyName: "",
        jobtitle: "",
        department: "",
        experienceperiod: "",
        modeofoperation: "",
    });
    const [parameterOptions, setParameterOptions] = useState([]);
    const [companyNames, setCompanyNames] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        fetchPositions();
        fetchParameterOptions();
        fetchCompanyNames();
    }, []);

    const fetchPositions = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/positions`);
            setPositions(response.data);
        } catch (error) {
            console.error("Positions fetching failed:", error);
        }
    };

    const fetchCompanyNames = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers`);
            console.log("customer : " + response.data);
            setCompanyNames(response.data);
        } catch (error) {
            console.error("Positions fetching failed:", error);
        }
    };

    const fetchParameterOptions = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/parameters`);
            setParameterOptions(response.data);
        } catch (error) {
            console.error("Parameter options fetching failed:", error);
        }
    };

    const handleFilterChange = (field, value) => {
        setFilters((prevFilters) => ({ ...prevFilters, [field]: value }));
    };

    const getParameterValues = (parameterTitle) => {
        const parameter = parameterOptions.find(
            (param) => param.title === parameterTitle
        );
        return parameter ? parameter.values : [];
    };

    const filteredPositions = positions.filter((position) => {
        const searchFields = [
            "positionname",
            "department",
            "jobtitle",
            "experienceperiod",
            "modeofoperation",
            "description",
            "worktype",
            "companyName",
        ];

        return (
            (filters.companyName === "" ||
                position.companyName === filters.companyName) &&
            (filters.jobtitle === "" || position.jobtitle === filters.jobtitle) &&
            (filters.department === "" ||
                position.department === filters.department) &&
            (filters.experienceperiod === "" ||
                position.experienceperiod === filters.experienceperiod) &&
            (filters.modeofoperation === "" ||
                position.modeofoperation === filters.modeofoperation) &&
            (searchTerm === "" ||
                filterFunction(searchFields, position, searchTerm.toLowerCase()))
        );
    });
    const handlePositionDetails = (positionId) => {
        if (positionId) {
            navigate(`/admin-position-detail/${positionId}`);
        } else {
            console.error(
                "Pozisyon detayları alınamadı: Pozisyon bilgileri eksik veya geçersiz."
            );
        }
    };
    
    const handleSearch = (value) => {
        setSearchTerm(value);
    };
    return (
        <div className="container mx-auto mt-12">
            <div className="flex justify-center items-center mb-4">
                <div className="flex items-end">
                    <SearchInput searchTerm={searchTerm} onSearch={handleSearch} />
                </div>

                <button
                    className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center  ml-2 "
                    onClick={() =>
                        setFilters({
                            companyName: "",
                            jobtitle: "",
                            department: "",
                            experienceperiod: "",
                            modeofoperation: "",
                        })
                    }
                >
                    Temizle
                </button>
            </div>
            <h2 className="text-center font-semibold text-3xl mb-6">
                Pozisyon Listesi
            </h2>
            <div className="overflow-x-auto px-2">
                <table className="table-auto w-full border-collapse border border-gray-400">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2">
                                Şirket Adı
                                <select
                                    className="ml-2 p-1 border border-gray-400 rounded-md"
                                    value={filters.companyName}
                                    onChange={(e) =>
                                        handleFilterChange("companyName", e.target.value)
                                    }
                                >
                                    <option value="">Tümü</option>
                                    {companyNames.map((value) => (
                                        <option key={value._id} value={value.companyname}>
                                            {value.companyname}
                                        </option>
                                    ))}
                                </select>
                            </th>
                            <th className="px-4 py-2">
                                Pozisyon Adı
                                <select
                                    className="ml-2 p-1 border border-gray-400 rounded-md"
                                    value={filters.jobtitle}
                                    onChange={(e) =>
                                        handleFilterChange("jobtitle", e.target.value)
                                    }
                                >
                                    <option value="">Tümü</option>
                                    {getParameterValues("İş Unvanı").map((value) => (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                            </th>
                            <th className="px-4 py-2">
                                Departman
                                <select
                                    className="ml-2 p-1 border border-gray-400 rounded-md"
                                    value={filters.department}
                                    onChange={(e) =>
                                        handleFilterChange("department", e.target.value)
                                    }
                                >
                                    <option value="">Tümü</option>
                                    {getParameterValues("Departman").map((value) => (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                            </th>
                            <th className="px-4 py-2">
                                Deneyim Süresi
                                <select
                                    className="ml-2 p-1 border border-gray-400 rounded-md"
                                    value={filters.experienceperiod}
                                    onChange={(e) =>
                                        handleFilterChange("experienceperiod", e.target.value)
                                    }
                                >
                                    <option value="">Tümü</option>
                                    {getParameterValues("Deneyim Süresi").map((value) => (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                            </th>
                            <th className="px-4 py-2">
                                Çalışma Şekli
                                <select
                                    className="ml-2 p-1 border border-gray-400 rounded-md"
                                    value={filters.modeofoperation}
                                    onChange={(e) =>
                                        handleFilterChange("modeofoperation", e.target.value)
                                    }
                                >
                                    <option value="">Tümü</option>
                                    {getParameterValues("İşyeri Politikası").map((value) => (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                            </th>
                            <th className="px-4 py-2">İş Tanımı</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPositions.map((position) => (
                            <tr key={position.id} className="bg-gray-100">
                                <td className="border px-4 py-2">{position.companyName}</td>
                                <td className="border px-4 py-2">{position.jobtitle}</td>
                                <td className="border px-4 py-2">{position.department}</td>
                                <td className="border px-4 py-2">
                                    {position.experienceperiod}
                                </td>
                                <td className="border px-4 py-2">{position.modeofoperation}</td>
                                <td className="border px-4 py-2">
                                    <div className="h-full flex row justify-between items-center ">
                                        <p>{position.description}</p>
                                        <button className='text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center' onClick={() => handlePositionDetails(position._id)}>
                                            detay
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminListPosition;
