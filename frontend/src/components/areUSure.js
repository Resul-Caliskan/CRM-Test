import React, { useState } from "react";
import { Button, Popconfirm, Tooltip } from "antd";
import { CheckCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const ConfirmPopUp = ({
  handleDelete,
  handleConfirm,
  isConfirm,
  id,
  record,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showPopconfirm = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
      if (isConfirm) {
        handleConfirm(record);
      } else {
        handleDelete(id);
      }
    }, 2000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      {isConfirm ? (
        <Popconfirm
          title={t("areUSure.confirm_and_send_email")}
          description={t("confirm_record_message")}
          open={open}
          okText={t("areUSure.confirm")}
          cancelText={t("areUSure.cancel")}
          onConfirm={handleOk}
          okButtonProps={{
            loading: confirmLoading,
            danger: false,
            style: { backgroundColor: "green" },
          }}
          onCancel={handleCancel}
        >
          <Tooltip placement={"top"} title={t("approve")}>
            <Button
              type="link"
              icon={<CheckCircleOutlined />}
              onClick={showPopconfirm}
            />
          </Tooltip>
        </Popconfirm>
      ) : (
        <Popconfirm
          title={t("areUSure.delete_record")}
          description={t("areUSure.delete_record_message")}
          open={open}
          okText={t("areUSure.delete")}
          cancelText={t("areUSure.cancel")}
          onConfirm={handleOk}
          okButtonProps={{
            loading: confirmLoading,
            danger: true,
          }}
          onCancel={handleCancel}
        >
          <Tooltip placement={"top"} title={t("delete")}>
            <Button
              type="link"
              icon={<DeleteOutlined />}
              onClick={showPopconfirm}
            />
          </Tooltip>
        </Popconfirm>
      )}
    </>
  );
};

export default ConfirmPopUp;
