import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedOption } from "../redux/selectedOptionSlice";
import ListComponent from "../components/listComponent";
import Notification from "../utils/notification";
import { highlightSearchTerm } from "../utils/highLightSearchTerm";
import FilterComponent from "../components/filterComponent";
import filterFunction from "../utils/globalSearchFunction";
import Loading from "../components/loadingComponent";
import { fetchData } from "../utils/fetchData";
import { login } from "../redux/authSlice";
import { useTranslation } from "react-i18next";

const ListCustomers = () => {
  const { t, i18n } = useTranslation();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [parameterOptions, setParameterOptions] = useState([]);
  const [isDelete, setIsDelete] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({
    sector: [],
    companytype: [],
  });
  useEffect(() => {
    if (user?.role === "admin") {
      fetchParameterOptions();
      fetchRolesFromDatabase();
      setIsDelete(false);
    }
  }, [isDelete]);

  const columns = [
    {
      title: () => t("listCustomer.company_name"),
      dataIndex: "companyname",
      key: "companyname",
      render: (text) => highlightSearchTerm(text, searchTerm),
      sorter: (a, b) => a.companyname.localeCompare(b.companyname),
    },

    {
      title: () => t("listCustomer.company_sector"),
      dataIndex: "companysector",
      key: "companysector",
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    {
      title: () => t("listCustomer.company_country"),
      dataIndex: "companycountry",
      key: "companycountry",
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    {
      title: () => t("listCustomer.company_city"),
      dataIndex: "companycity",
      key: "companycity",
      render: (text) => highlightSearchTerm(text, searchTerm),
      sorter: (a, b) => a.companycity.localeCompare(b.companycity),
    },
    {
      title: () => t("listCustomer.company_contactName"),
      dataIndex: "contactname",
      key: "contactname",
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    {
      title: () => t("listCustomer.company_contactMail"),
      dataIndex: "contactmail",
      key: "contactmail",
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
    {
      title: () => t("listCustomer.company_contactNumber"),
      dataIndex: "contactnumber",
      key: "contactnumber",
      render: (text) => highlightSearchTerm(text, searchTerm),
    },
  ];
  const filteredCustomers = customers.filter((customer, index) => {
    const searchFields = [
      "companyname",
      "companytype",
      "companysector",
      "companyadress",
      "companycity",
      "companycountry",
      "companycounty",
      "companyweb",
      "contactname",
      "contactmail",
      "contactnumber",
    ];

    const { sector, companytype } = filters;

    return (
      (sector.length === 0 || sector.includes(customer.companysector)) &&
      (companytype.length === 0 ||
        companytype.includes(customer.companytype)) &&
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
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/customers`
      );
      setCustomers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Roles fetching failed:", error);
    }
  };
  const fetchParameterOptions = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/parameters`
      );
      const filteredOptions = response.data.filter((option) => {
        return (
          (option.title === "Sektör" &&
            (option.title = t("userListPosition.sector"))) ||
          (option.title === "Firma Türü" &&
            (option.title = t("userListPosition.company_type")))
        );
      });
      setParameterOptions(filteredOptions);
    } catch (error) {
      console.error("Parameter options fetching failed:", error);
    }
  };

  const handleEditCustomer = (customerId) => {
    navigate(`/edit-customer/${customerId}`);
  };
  const handleDetailCustomer = (customerId) => {
    navigate(`/detail-customer/${customerId}`);
  };
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleAddCustomer = () => {
    dispatch(setSelectedOption("add-customer"));
  };
  const handleDelete = async (customerId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/customers/${customerId}`
      );
      setCustomers(
        customers.filter((customer) => customer.companyId !== customerId)
      );
      Notification("success", t("customer_deleted_success"), "");
      setIsDelete(true);
    } catch (error) {
      Notification("error", t("customer_deletion_error"), "");
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-row justify-evenly  bg-[#FAFAFA]">
          <div
            className="hidden sideFilter  sm:flex  sm:flex-col sm:w-[280px] md:w-[30%]">
            <FilterComponent
              setFilters={setFilters}
              parameterOptions={parameterOptions}
              isHorizontal={false}
            />
          </div>
          <div className="flex flex-col w-full contentCV overflow-y-auto ">
            <ListComponent
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              dropdowns={
                <FilterComponent
                  setFilters={setFilters}
                  parameterOptions={parameterOptions}
                />
              }
              handleAdd={handleAddCustomer}
              handleUpdate={handleEditCustomer}
              handleDelete={handleDelete}
              handleDetail={handleDetailCustomer}
              columns={columns}
              data={data}
              name={t("listCustomer.company_list")}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ListCustomers;
