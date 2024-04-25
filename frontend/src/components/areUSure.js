import React, { useState } from 'react';
import { Button, Popconfirm } from 'antd';
import { CheckCircleOutlined, DeleteOutlined } from '@ant-design/icons';
const ConfirmPopUp = ({ handleDelete, handleConfirm, isConfirm, id, record }) => {
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
      }
      else {
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
          title="Kaydı Onayla ve Mail Gönder"
          description="Bu kaydı onaylamak istediğinize emin misiniz?"
          open={open}
          okText="Onayla"
          cancelText="İptal"
          onConfirm={handleOk}

          okButtonProps={{
            loading: confirmLoading,
            danger: false,
            style: { backgroundColor: 'green' }
          }}

          onCancel={handleCancel}
        >
          <Button
            type="link"
            icon={<CheckCircleOutlined />}
            onClick={showPopconfirm}
          />
        </Popconfirm>
      ) : (
        <Popconfirm
          title="Kaydı Sil"
          description="Bu kaydı silmek istediğinize emin misiniz?"
          open={open}
          okText="Sil"
          cancelText="İptal"
          onConfirm={handleOk}
          okButtonProps={{
            loading: confirmLoading,
            danger: true,
          }}
          onCancel={handleCancel}
        >
          <Button
            type="link"
            icon={<DeleteOutlined />}
            onClick={showPopconfirm}
          />
        </Popconfirm>
      )}
    </>

  );
};
export default ConfirmPopUp;