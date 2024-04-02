import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setSelectedOption } from '../redux/selectedOptionSlice';
import ListComponent from '../components/listComponent';
import Notification from '../utils/notification';
import { highlightSearchTerm } from '../utils/highLightSearchTerm';
import FilterComponent from '../components/filterComponent';
import filterFunction from '../utils/globalSearchFunction';
import Loading from '../components/loadingComponent';

const ListCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [parameterOptions, setParameterOptions] = useState([]);
  const [isDelete, setIsDelete] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState({
    sector: [],
    companytype: []
  });
  useEffect(() => {
    fetchParameterOptions();
    console.log("x" + parameterOptions);
    fetchRolesFromDatabase();
    setIsDelete(false);
   

  }, [isDelete]);

  const columns = [
    {
      title: 'Şirket Adı',
      dataIndex: 'companyname',
      key: 'companyname',
      render: (text) => highlightSearchTerm(text, searchTerm),
      sorter: (a, b) => a.companyname.localeCompare(b.companyname),
    },
    {
      title: 'Türü',
      dataIndex: 'companytype',
      key: 'companytype',
      render: (text) => highlightSearchTerm(text, searchTerm),
      sorter: (a, b) => a.companytype.localeCompare(b.companytype),
    },
    {
      title: 'Sektör',
      dataIndex: 'companysector',
      key: 'companysector',
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    {
      title: 'Ülke',
      dataIndex: 'companycountry',
      key: 'companycountry',
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    {
      title: 'İl',
      dataIndex: 'companycity',
      key: 'companycity',
      render: (text) => highlightSearchTerm(text, searchTerm),
      sorter: (a, b) => a.companycity.localeCompare(b.companycity),
    },
    {
      title: 'İlçe',
      dataIndex: 'companycounty',
      key: 'companycounty',
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    {
      title: 'Adres',
      dataIndex: 'companyadress',
      key: 'companyadress',
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    {
      title: 'Website',
      dataIndex: 'companyweb',
      key: 'companyweb',
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    {
      title: 'İlgili Kişi İsim',
      dataIndex: 'contactname',
      key: 'contactname',
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    {
      title: 'İlgili Kişi Mail',
      dataIndex: 'contactmail',
      key: 'contactmail',
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    {
      title: 'İlgili Kişi Numara',
      dataIndex: 'contactnumber',
      key: 'contactnumber',
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
  ];
  const filteredCustomers = customers.filter((customer, index) => {
    const searchFields = [
      'companyname',
      'companytype',
      'companysector',
      'companyadress',
      'companycity',
      'companycountry',
      'companycounty',
      'companyweb',
      'contactname',
      'contactmail',
      'contactnumber',
    ];

    const {
      sector,
      companytype
    } = filters;

    return (
      (sector.length === 0 ||
        sector.includes(customer.companysector)) &&
      (companytype.length === 0 || companytype.includes(customer.companytype)) &&

      (searchTerm === "" ||
        filterFunction(searchFields, customer, searchTerm.toLowerCase()))
    );
  });
  const data = filteredCustomers.map((customer, index) => ({
    key: index,
    id: customer._id,
    companyname: customer.companyname,
    companytype: customer.companytype,
    companysector: customer.companysector,
    companyadress: customer.companyadress,
    companycity: customer.companycity,
    companycountry: customer.companycountry,
    companycounty: customer.companycounty,
    companyweb: customer.companyweb,
    contactname: customer.contactname,
    contactmail: customer.contactmail,
    contactnumber: customer.contactnumber,
  }));
  const fetchRolesFromDatabase = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers`);
      setCustomers(response.data);
      console.log(response.data);
        setLoading(false);
    } catch (error) {
      console.error('Roles fetching failed:', error);

    }

  };
  const fetchParameterOptions = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/parameters`
      );
      const filteredOptions = response.data.filter(option => {
        return option.title === "Sektör" || option.title === "Firma Türü";
      });
      console.log(filteredOptions);
      setParameterOptions(filteredOptions);
    } catch (error) {
      console.error("Parameter options fetching failed:", error);
    }
  };


  const handleEditCustomer = (customerId) => {
    navigate(`/edit-customer/${customerId}`);
  };


  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleAddCustomer = () => {
    dispatch(setSelectedOption('add-customer'));
  };
  const handleDelete = async (customerId) => {
    try {
      console.log(customerId);
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/customers/${customerId}`);
      setCustomers(customers.filter(customer => customer.companyId !== customerId));
      Notification("success", "Müşteri başarıyla silindi.", "");
      setIsDelete(true);
      
    } catch (error) {
      Notification("error", "Müşteri silinirken bir hata oluştu.", "");
    }
  };

  return (
    <>
    {loading ? <Loading /> 
       : (
      <ListComponent
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        dropdowns={
          <FilterComponent
            setFilters={setFilters}
            parameterOptions={parameterOptions}
          />}
        handleAdd={handleAddCustomer}
        handleUpdate={handleEditCustomer}
        handleDelete={handleDelete}
        columns={columns}
        data={data}
        name={"Müşteri Listesi"}
      />)}
    </>
  );
};

export default ListCustomers;