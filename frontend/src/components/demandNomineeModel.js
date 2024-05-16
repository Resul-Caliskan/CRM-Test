import { Button, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { getIdFromToken } from "../utils/getIdFromToken";
import axios from "axios";
import socket from "../config/config";
import Notification from "../utils/notification";
import { useTranslation } from "react-i18next";

const DemandNomineeModel = ({
  open,
  setOpen,
  nomineeId,
  positions,
  setIsRequested,
  setIsClicked,
  setPositions,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [selectedPositionIndex, setSelectedPositionIndex] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;
  const companyId = getIdFromToken(localStorage.getItem("token"));

  const handleOk = () => {
    setOpen(false);
    if (selectedPositionIndex !== null) {
      handleRequest(selectedPositionIndex);
    }
  };

  const handleCancel = () => {
    setIsClicked(false);
    setOpen(false);
  };

  const handleSelectChange = (value) => {
    setSelectedPositionIndex(value);
  };

  const handleRequest = async () => {
    const id = positions[selectedPositionIndex]._id;

    try {
      const response2 = await axios.put(
        `${apiUrl}/api/positions/request/${id}`,
        { nomineeId: nomineeId }
      );
      socket.emit("createDemand", id);
      setPositions((prevPositions) => {
        const updatedPositions = [...prevPositions];
        updatedPositions[selectedPositionIndex] = {
          ...updatedPositions[selectedPositionIndex],
          requestedNominees: [
            ...updatedPositions[selectedPositionIndex].requestedNominees,
            nomineeId,
          ],
        };
        return updatedPositions;
      });

      try {
        const response = await axios.post(`${apiUrl}/api/notification/add`, {
          message:
            response2.data.updatedPosition.companyName +
            " " +
            response2.data.updatedPosition.jobtitle +
            " pozisyonu için yeni aday talep etti",
          type: "nomineeDemand",
          url: `/admin-position-detail/${id}`,
          companyId: response2.data.updatedPosition.companyId,
          positionId: id,
          nomineeId: nomineeId,
          receiverCompanyId: "660688a38e88e341516e7acd",
        });
        socket.emit("notificationCreated", response.data.notificationId);
      } catch (error) {
        console.error(error + "bildirim iletilemedi.");
      }
      setIsClicked(false);
      setIsRequested(false);
      Notification("success", t("position_detail.request_success"));
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Notification("error", t("position_detail.requested_already"));
      } else {
        Notification("error", t("position_detail.requested_error"));
        console.error("Aday talep edilirken bir hata oluştu:", error.message);
      }
      setIsClicked(false);
    }
  };

  // const generatePositionKey = (title, index) => {
  //   const initials = title
  //     .split(' ')
  //     .map(word => word.charAt(0).toUpperCase())
  //     .join('');
  //   const keyCount = positions
  //     .slice(0, index + 1)
  //     .filter(position => position.jobtitle.split(' ').map(word => word.charAt(0).toUpperCase()).join('') === initials)
  //     .length;
  //   return `${initials}-${keyCount}`;
  // };

  return (
    <Modal
      zIndex={1000}
      mask={true}
      title={t("select_position")}
      visible={open}
      onCancel={handleCancel}
      cancelText={t("reject")}
      onOk={handleOk}
      okText={t("request_position")}
      okType="default"
      centered={true}
    >
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder={t("select_position")}
        loading={loading}
        optionFilterProp="children"
        filterOption={(input, option) =>
          option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        onChange={handleSelectChange}
        value={selectedPositionIndex}
      >
        {positions.map((position, index) => (
          <Select.Option key={index} value={index}>
            {`${position.jobtitle}`}
          </Select.Option>
        ))}
      </Select>
    </Modal>
  );
};

export default DemandNomineeModel;
