import axios from 'axios';

const api = axios.create({
    baseURL: "https://hospitality.youcast.tv.br/",
    headers: {
      "Content-Type": "application/json",
    }
  });

export default api