import React, { useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Input,
  Popconfirm,
  Space,
  Table,
  Tooltip,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedOption } from "../redux/selectedOptionSlice";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ConfirmPopUp from "./areUSure";
import "./style.css";
import { useTranslation } from "react-i18next";

const ListComponent = ({
  searchTerm,
  setSearchTerm,
  handleAdd,
  handleUpdate,
  handleDelete,
  handleDetail,
  handleApprove,
  data,
  columns,
  name,
  notification,
  checkbox,
}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const { t } = useTranslation();
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
    <div className="bodyContainer">
      <div className="searchFilterButton">
        <div className="search">
          <div className="searchButtonContainer">
            <Input
              placeholder={t("search_placeholder")}
              className="searchButton"
              onChange={handleSearch}
              suffix={<SearchOutlined />}
            ></Input>
          </div>
        </div>
        <div className="crudButtons">
          {handleAdd && (
            <Button
              type="primary"
              onClick={() => handleAdd()}
              icon={<PlusOutlined />}
              size="large"
              className="buttonAdd"
            >
              {t("new_record")}
            </Button>
          )}
        </div>
      </div>
      <div className="listContent">
        <div className="title">
          <h4 className="titleLabel">{name}</h4>
          <p className="titleContent">
            {t("total_results", { count: data.length })}
          </p>
        </div>
        <div className="listData">
          <div className="onlyData">
            <Table
              columns={[
                ...columns,
                {
                  title: t("actions"),
                  key: "action",
                  render: (text, record) => (
                    <Space
                      size="small"
                      className="flex justify-center items-center"
                    >
                      {handleUpdate && (
                        <Tooltip
                          placement={"top"}
                          title={t("profile.buttons.edit")}
                        >
                          <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => {
                              handleUpdate(record.id);
                            }}
                          ></Button>
                        </Tooltip>
                      )}

                      {handleApprove && (
                        <ConfirmPopUp
                          handleConfirm={handleApprove}
                          record={record}
                          isConfirm={true}
                        />
                      )}

                      {handleDelete && (
                        <ConfirmPopUp
                          handleDelete={handleDelete}
                          id={record.id}
                          isConfirm={false}
                        />
                      )}
                      {notification ? (
                        <Tooltip placement={"top"} title={t("details")}>
                          <button onClick={() => handleDetail(record.id)}>
                            <Badge
                              count={record.requestedNominees?.length}
                              className=""
                              size="small"
                            >
                              <Avatar
                                className="bg-white text-blue-500"
                                shape="square"
                                icon={<InfoCircleOutlined />}
                                size="medium"
                              />
                            </Badge>
                          </button>
                        </Tooltip>
                      ) : (
                        handleDetail && (
                          <Tooltip placement={"top"} title={t("details")}>
                            <Button
                              type="link"
                              icon={<InfoCircleOutlined />}
                              onClick={() => handleDetail(record.id)}
                            ></Button>
                          </Tooltip>
                        )
                      )}
                    </Space>
                  ),
                },
              ]}
              dataSource={data}
              
              mobileBreakPoint={768}
              pagination={{
                locale: { items_per_page: "/ Sayfa", jump_to: "Git", page: "" },
                total: data.length,
                showSizeChanger: true,
                showQuickJumper: true,
                pageSizeOptions: ["10", "20", "30", "40", "50"],
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
