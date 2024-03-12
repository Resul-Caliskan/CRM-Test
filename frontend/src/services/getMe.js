import axios from 'axios';

export const getMe = async () => {
   
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/me`);
        return response.data;
    } catch (error) {
        console.error('GET isteği hatası:', error);
        throw error; 
    }
};
