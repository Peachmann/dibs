import axios from 'axios';

const getApi = () => {
  if (import.meta.env.VITE_APP_ENV !== 'PROD') {
    return axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
  } else {
    return axios.create({
      baseURL: import.meta.env.VITE_API_URL
    });
  }
};

const api = getApi();

export default api;
