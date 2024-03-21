import { notification } from 'antd';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const showNotification = (success, messageText, redirectUrl) => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    ReactDOM.render(
        <NotificationWrapper
            success={success}
            messageText={messageText} 
            redirectUrl={redirectUrl}
        />,
        container
    );
};

const NotificationWrapper = ({ success, messageText, redirectUrl }) => {
    const [timeLeft, setTimeLeft] = useState(3);
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        if (timeLeft === 0) {
            if (redirectUrl) {
                window.location.href = redirectUrl;
            } else {
                closeNotification();
            }
        }
        
        return () => {
            clearInterval(timer);
        };
    }, [timeLeft, redirectUrl]);

    const closeNotification = () => {
        const container = document.querySelector('.notification-container');
        ReactDOM.unmountComponentAtNode(container);
        document.body.removeChild(container);
    };

    const handleBackdropClick = () => {
        if (!redirectUrl) {
            closeNotification();
        }
    };

    return (
        <div className="notification-container">
            <Notification success={success} messageText={messageText} />
            <div
                className="backdrop"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 9998,
                }}
                onClick={handleBackdropClick}
            ></div>
            <div
                className="notification-content"
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 9999,
                    backgroundColor: '#fff',
                    color: '#333',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                    maxWidth: '300px',
                    transition: 'transform 0.3s ease',
                    opacity: '1',
                }}
            >
                {messageText && (
                    <div
                        style={{
                            width:500,
                            height:100,
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 9999,
                            backgroundColor: success ? '#52c41a' : '#ff4d4f',
                            color: '#fff',
                            padding: '20px',
                            borderRadius: '5px',
                            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.2)',
                            textAlign: 'center',
                        }}
                    >
                        {messageText}
                        <br />
                        {timeLeft} saniye sonra yönlendirileceksiniz.
                    </div>
                )}
            </div>
        </div>
    );
};

const Notification = ({ success, messageText }) => {
    return (
        <div
            style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 9999,
                backgroundColor: success ? 'green' : '#ff4d4f',
                color: '#fff',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.2)',
                textAlign: 'center',
            }}
        >
            {success ? <CheckCircleOutlined style={{ fontSize: '24px' }} /> : <CloseCircleOutlined style={{ fontSize: '24px' }} />}
            <br />
        </div>
    );
};

export default showNotification;
