import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchInput from '../components/searchInput';
import Highlighter from 'react-highlight-words';
import { IoAddCircleSharp } from "react-icons/io5";
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedOption } from '../redux/selectedOptionSlice';

const ListCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const selectedOption = useSelector(state => state.selectedOption.selectedOption);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRolesFromDatabase();
  }, []);

  const fetchRolesFromDatabase = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers`);
      setCustomers(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Roles fetching failed:', error);
    }
  };

  const handleEditCustomer = (customerId) => {
    navigate(`/edit-customer/${customerId}`);
  };

  const filteredCustomers = customers.filter((customer) => {
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

    const searchTermLowerCase = searchTerm.toLowerCase();

    return searchFields.some(field => {
      const fieldValue = customer[field] ? customer[field].toLowerCase() : ''; // Alan değerini küçük harfe dönüştür
      return fieldValue.includes(searchTermLowerCase); // Küçük harfe dönüştürülmüş arama terimini içeriyorsa true döndür
    });
  });
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleAddCustomer = () => {
    dispatch(setSelectedOption('add-customer'));
  };
  return (
    <div className="w-full h-100 mx-auto px-10 py-8">
      <div className="mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <h1 className="text-3xl font-semibold mb-4 text-center py-4 bg-gray-100">Müşteri Listesi</h1>
        <div className="p-4">
          <SearchInput searchTerm={searchTerm} onSearch={handleSearch} />

          <button
            className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-large rounded-lg text-sm px-4 py-2 text-center  ml-2 mb-5"
            onClick={handleAddCustomer}
          >
            Müşteri Ekle{" "}
            <IoAddCircleSharp
              className="inline-block ml-3"
              style={{ fontSize: "24px" }}
            />
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((customer, index) => (


              <div key={index} className="bg-gray-200 p-4 rounded-md">
                <h2 className="text-xl font-semibold mb-2">

                  <Highlighter
                    highlightClassName="highlighted"
                    searchWords={[searchTerm]}
                    autoEscape={true}
                    textToHighlight={customer.companyname || ''}
                  />
                </h2>
                <hr className="border-gray-300 my-2" />


                <p>
                  <span className="font-semibold">Firma Türü:</span>{' '}
                  <Highlighter
                    highlightClassName="highlighted"
                    searchWords={[searchTerm]}
                    autoEscape={true}
                    textToHighlight={customer.companytype || ''}
                  />
                </p>

                <p>
                  <span className="font-semibold">Sektör:</span>{' '}
                  <Highlighter
                    highlightClassName="highlighted"
                    searchWords={[searchTerm]}
                    autoEscape={true}
                    textToHighlight={customer.companysector || ''}
                  />
                </p>

                <p>
                  <span className="font-semibold">Web Sitesi:</span>{' '}
                  <Highlighter
                    highlightClassName="highlighted"
                    searchWords={[searchTerm]}
                    autoEscape={true}
                    textToHighlight={customer.companyweb || ''}
                  />
                </p>

                {/* <p>
                <span className="font-semibold">Ülke:</span>{' '}
                <Highlighter
                  highlightClassName="highlighted"
                  searchWords={[searchTerm]}
                  autoEscape={true}
                  textToHighlight={customer.companycountry ||''}
                />
              </p> */}

                {/* <p>
                <span className="font-semibold">Şehir:</span>{' '}
                <Highlighter
                  highlightClassName="highlighted"
                  searchWords={[searchTerm]}
                  autoEscape={true}
                  textToHighlight={customer.companycity ||''}
                />
              </p>

              <p>
                <span className="font-semibold">İlçe:</span>{' '}
                <Highlighter
                  highlightClassName="highlighted"
                  searchWords={[searchTerm]}
                  autoEscape={true}
                  textToHighlight={customer.companycounty ||''}
                />
              </p> */}

                <p>
                  <span className="font-semibold">Adres:</span>{' '}
                  <Highlighter
                    highlightClassName="highlighted"
                    searchWords={[searchTerm]}
                    autoEscape={true}
                    textToHighlight={customer.companyadress || ''}
                  />
                </p>

                <p>
                  <span className="font-semibold">İlgili Kişi:</span>{' '}
                  <Highlighter
                    highlightClassName="highlighted"
                    searchWords={[searchTerm]}
                    autoEscape={true}
                    textToHighlight={customer.contactname || ''}
                  />
                </p>

                <p>
                  <span className="font-semibold">İlgili Kişi Numarası:</span>{' '}
                  <Highlighter
                    highlightClassName="highlighted"
                    searchWords={[searchTerm]}
                    autoEscape={true}
                    textToHighlight={customer.contactnumber || ''}
                  />
                </p>

              <p>
                <span className="font-semibold">İlgili Kişi Email:</span>{' '}
                <Highlighter
                  highlightClassName="highlighted"
                  searchWords={[searchTerm]}
                  autoEscape={true}
                  textToHighlight={customer.contactmail ||''}
                />
              </p>
              
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2" onClick={() => handleEditCustomer(customer._id)}>
                Düzenle
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
};

export default ListCustomers;