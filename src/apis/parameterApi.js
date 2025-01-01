import { axiosInstance } from "./apiConfig";

export const createParameter = async (data) => {
    const response = await axiosInstance.post('/parameter', data);
    return response.data;
};

export const getAllParameters = async () => {
    const response = await axiosInstance.get('/parameters');
    return response.data;
};

export const getParameter = async (id) => {
    const response = await axiosInstance.get(`/parameter/${id}`);
    return response.data;
};

export const updateParameter = async (id, data) => {
    const response = await axiosInstance.put(`/parameter/${id}`, data);
    return response.data;
};

export const deleteParameter = async (id) => {
    const response = await axiosInstance.delete(`/parameter/${id}`);
    return response.data;
};
