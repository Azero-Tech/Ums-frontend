import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL : `${process.env.REACT_APP_BASEURL}/api/v1` || "",
    withCredentials : true
})

const API = axios.create({
  baseURL: 'https://waba.automatebusiness.com/cloud',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.REACT_APP_WABA_API_KEY}`, // Add your API key
  },
});

export const sendTemplateMessage = async (data) => {
    const response = await API.post('/messages', data); // Endpoint for sending messages
    return response.data;
};
