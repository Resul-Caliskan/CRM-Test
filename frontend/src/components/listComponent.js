import React, { useState } from "react";
import { Button, Input, Space } from "antd";
import  Table from 'antd/lib/table'
import { useSelector, useDispatch } from "react-redux";
import { setSelectedOption } from "../redux/selectedOptionSlice";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./style.css";


const ListComponent = ({ dropdowns,searchTerm,setSearchTerm,handleAdd, handleUpdate, handleDelete, handleDetail, handleApprove, data, columns, name }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectionType, setSelectionType] = useState("checkbox");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
  };
  const handleItemClick = (item) => {
    const selectedIndex = selectedItems.indexOf(item);
    if (selectedIndex === -1) {
      setSelectedItems([...selectedItems, item]);
    } else {
      const updatedItems = [...selectedItems];
      updatedItems.splice(selectedIndex, 1);
      setSelectedItems(updatedItems);
    }
  };

  const dispatch = useDispatch();

  const handleOptionClick = (option) => {
    dispatch(setSelectedOption(option));
  };


  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      name: record.name,
    }),
  };

  return (
    <div className="body bg-red-500">
     <p>Niye Çalışmıyor</p>
    </div>
  );
};
export default ListComponent;
