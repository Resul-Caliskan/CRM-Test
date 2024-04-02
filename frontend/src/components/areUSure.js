import React, { useState } from 'react';
import { Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
const ConfirmPopUp = ({handleDelete , id}) => {
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
      handleDelete(id);
      console.log(id);
    }, 2000);
  };
  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };
  return (
    <Popconfirm
      title="Kaydı Sil"
      description="Bu kaydı silmek istediğinize emin misiniz?"
      open={open}
      c
      onConfirm={handleOk}
      okButtonProps={{
        loading: confirmLoading,
        danger:true,
      }}
      onCancel={handleCancel}
    >
      <Button
        type="link"
        icon={<DeleteOutlined />}
        onClick={showPopconfirm}
      >
      </Button>
    </Popconfirm>
  );
};
export default ConfirmPopUp;