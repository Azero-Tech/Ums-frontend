import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BASEURL}/api/v1` || "",
  withCredentials: true,
});

const API_URL = "https://waba.automatebusiness.com/cloud/v15.0";

export const sendTemplateMessage = async (message) => {
  const response = await axios.post(
    `${API_URL}/${process.env.REACT_APP_PHONE_NUMBER_ID}/messages`,
    message,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_WABA_API_KEY}`,
      },
    }
  );

  return response.data;
};
