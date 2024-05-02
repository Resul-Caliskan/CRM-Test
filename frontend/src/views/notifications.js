
import React, { useEffect, useState } from 'react';
import { Table, Button, Checkbox, Radio } from 'antd';
import "../components/style.css";
import { CheckOutlined } from '@ant-design/icons';
import axios from 'axios';
import { getIdFromToken } from '../utils/getIdFromToken';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import socket from '../config/config';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState(notifications);
  const [filter, setFilter] = useState();
  const [loading, setLoading] = useState(false);
  const companyId = getIdFromToken(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('createdNot', (notification) => {
      if (notification.receiverCompanyId === companyId) {
        setNotifications((prev) => [notification, ...prev]);
        setFilteredNotifications((prev) => [notification, ...prev]);
      }

    });
    socket.on('deletedNot', (deletedNotification) => {
      if (deletedNotification.receiverCompanyId === companyId) {
        console.log("zartzort" + deletedNotification);
        setNotifications((prev) => prev.filter(notification => notification._id !== deletedNotification));
        setFilteredNotifications((prev) => prev.filter(notification => notification._id !== deletedNotification));
      }
    });
    socket.on('createdPositionNot', (notification) => {
      console.log("ilk not:"+notification.receiverCompanyId);
      if (notification.receiverCompanyId === companyId) {
        console.log("notification:"+notification);
        setNotifications((prev) => [notification, ...prev]);
        setFilteredNotifications((prev) => [notification, ...prev]);
      }
    })
  }, []);

  useEffect(() => {

    fetchNotifications();
    setFilter("all");
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/notification/get-notifications/${companyId}`,

      );
      console.log(response.data.notifications);
      const filteredNotes = response.data.notifications.reverse();
      setNotifications(filteredNotes);
      setFilteredNotifications(filteredNotes);
    } catch (error) {
      console.error(error + "Bildirimler alınamadı.")
    }
    setLoading(false);

  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };
  const handleMarkAsRead = async () => {
    try {
      const updatedNotifications = await Promise.all(
        notifications.map(async (notification) => {
          if (selectedRows.includes(notification._id)) {
            try {
              const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/api/notification/mark-as-read/${notification._id}`
              );
              return { ...notification, state: true }; // Bildirimi güncelle, okundu olarak işaretle

            } catch (error) {
              console.error(error, "Bildirimler alınamadı.");
              return notification;
            }
          } else {
            return notification;
          }
        })
      );


      console.log(updatedNotifications);


      setNotifications(updatedNotifications);


      setFilteredNotifications(updatedNotifications);

      setSelectedRows([]);
    } catch (error) {
      console.error(error, "Bildirimler güncellenemedi.");
    }
  };

  const handleNotificationClick = async (id, url) => {
    try {

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/notification/mark-as-read/${id}`
      );

      const updatedNotification = response.data;

      const updatedNotifications = notifications.map(notification => {
        if (notification._id === id && !notification.state) {
          return { ...notification, state: true };
        }
        return notification;
      });

      setNotifications(updatedNotifications);
      setFilteredNotifications(updatedNotifications);

      navigate(url);
    } catch (error) {
      console.error("Bildirimin durumu güncellenirken bir hata oluştu:", error);
    }
  };


  const handleChangeNotification = (readStatus) => {
    setFilter(readStatus);
    if (readStatus === 'read') {
      const readNotifications = notifications.filter(notification => notification.state);
      setFilteredNotifications(readNotifications);
    } else if (readStatus === 'unread') {
      const unreadNotifications = notifications.filter(notification => !notification.state);
      setFilteredNotifications(unreadNotifications);
    } else {
      setFilteredNotifications(notifications);
    }
  };



  const columns = [
    {
      title: (
        <Checkbox
          onChange={(e) => handleSelectAll(e)}
          checked={selectedRows.length === notifications.length && notifications.length !== 0}
        />
      ),
      key: 'selectAll',
      render: (text, record) => (
        <Checkbox
          onChange={() => handleSelectRow(record._id)}
          checked={selectedRows.includes(record._id)}
        />
      ),
    },
    {
      title: 'Mesaj',
      dataIndex: 'message',
      key: 'message',
      render: (text, record) => (
        <span
          style={{ cursor: 'pointer', color: record.state ? 'gray' : '', textDecoration: 'underline', fontWeight: record.state ? '' : 'bold' }}
          onClick={() => handleNotificationClick(record._id, record.url)}
        >
          {text}
        </span>
      ),
    },
  ];

  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    const selectedRowsIds = checked ? notifications.map(notification => notification._id) : [];
    setSelectedRows(selectedRowsIds);
  };

  return (
    <div className='body'>
      <div className="notification-page w-full h-screen">
        <div style={{ marginBottom: '10px' }}>
          <Radio.Group onChange={(e) => handleChangeNotification(e.target.value)} value={filter}>
            <Radio.Button value={"all"}>Tümü</Radio.Button>
            <Radio.Button value="read">Okundu</Radio.Button>
            <Radio.Button value="unread">Okunmamış</Radio.Button>
          </Radio.Group>

          <Button
            type="link"
            onClick={handleMarkAsRead}
            style={{ marginLeft: '20px' }}
            icon={<CheckOutlined />}
            size="medium"
          >
            Okundu Olarak İşaretle
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={filteredNotifications}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default NotificationPage;
