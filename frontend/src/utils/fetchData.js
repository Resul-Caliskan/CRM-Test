import { getMe } from "../services/getMe";

export  async function fetchData() {
    try {
      const responseMe = await getMe();
      return responseMe;
    } 
    catch (error) {
      throw new Error('Veri alınamadı.');
    }
  }