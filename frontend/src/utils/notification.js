import { notification } from 'antd';
 
const Notification = (success, messageText) => {
    if (success) {
        notification.success({
            message: 'Başarılı',
            description: messageText,
            duration: 3, 
        });
    } else {
        notification.error({
            message: 'Hata',
            description: messageText,
            duration: 3,
        });
    }
};
 
export default Notification;