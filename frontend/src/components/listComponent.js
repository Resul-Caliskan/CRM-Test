import React, { useState } from "react";
import { Button, Input, Popconfirm, Space, Table } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedOption } from "../redux/selectedOptionSlice";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ConfirmPopUp from "./areUSure";
import "./style.css";


const ListComponent = ({ dropdowns, searchTerm, setSearchTerm, handleAdd, handleUpdate, handleDelete, handleDetail, handleApprove, data, columns, name }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectionType, setSelectionType] = useState("checkbox");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const navigate = useNavigate();

  const showPopconfirm = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);

    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
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
    <div className="body">
      <div className="searchFilterButton">
        <div className="search">
          <div className="searchButtonContainer">
            <Input
              placeholder="Search"
              className="searchButton"
              onChange={handleSearch}
              suffix={<SearchOutlined />}
            ></Input>
          </div>
          <div className="filterSearch">
            {dropdowns}

          </div>
        </div>
        <div className="crudButtons">
          {/* <Button
            size="large"
            onClick={() => handleOptionClick(handleUpdate)}
            className="buttonEdit"
          >
            Sil
          </Button> */}
          {handleAdd && <Button
            type="primary"
            onClick={() => handleAdd()}
            icon={<PlusOutlined />}
            size="large"
            className="buttonAdd"
          >
            Yeni Kayıt
          </Button>}
        </div>
      </div>
      <div className="listContent">
        <div className="title">
          <h4 className="titleLabel">{name}</h4>
          <p className="titleContent">
            Toplam {data.length} sonuç listelendi
          </p>
        </div>
        <div className="listData">
          <div className="onlyData">

            <Table

              columns={[
                ...columns,
                {
                  title: '',
                  key: 'action',
                  render: (text, record) => (
                    <Space size="small" className="flex justify-center items-center">
                      {handleUpdate && <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => {
                          console.log("Clicked on companyId:", record.id);
                          handleUpdate(record.id);

                        }}
                      >
                      </Button>}

                      {handleApprove && 
                        <ConfirmPopUp handleConfirm={handleApprove} record={record} isConfirm={true} />
                      
                      }
                      {handleDelete && (
                        <ConfirmPopUp handleDelete={handleDelete} id={record.id} isConfirm={false} />
                      )}
                      {handleDetail && <Button
                        type="link"
                        icon={<InfoCircleOutlined />}
                        onClick={() => handleDetail(record.id)}
                      >
                      </Button>}
                    </Space>
                  ),
                },
              ]}
              dataSource={data}
              scroll={{ y: 600 }}
              mobileBreakPoint={768}
              pagination={{
                pageSizeOptions: [],
                showQuickJumper: true,
                total: data.length,

              }}
            />
          </div>
        </div>
      </div>
      <div className="footer"></div>
    </div>
  );
};
export default ListComponent;
