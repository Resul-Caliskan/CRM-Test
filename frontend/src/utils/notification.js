import { notification } from 'antd';
 
const Notification = (type, message, description) => {
    const config = {
        message: message,
        description: description,
        duration: 3,
        style: {
            borderRadius: '8px',
            padding: '20px 24px'
        },
    };
 
    if (type === "success") {
        notification.success({
            ...config,
            style: {
                ...config.style,
                backgroundColor: '#F6FFED',
                color: '#52c41a'
            }
        });
    } else if (type === "error") {
        notification.error({
            ...config,
            style: {
                ...config.style,
                backgroundColor: '#fff1f0',
                color: '#f5222d'
            }
        });
    }
};
 
export default Notification;