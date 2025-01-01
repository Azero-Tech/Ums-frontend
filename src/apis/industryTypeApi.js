import { axiosInstance } from "./apiConfig";

export const createType = async (data) => {
    const response = await axiosInstance.post("/type", data);
    return response.data;
};

export const getAllTypes = async () => {
    const response = await axiosInstance.get("/types");
    return response.data;
};

export const getType = async (id) => {
    const response = await axiosInstance.get(`/type/${id}`);
    return response.data;
};

export const updateType = async (id, data) => {
    const response = await axiosInstance.put(`/type/${id}`, data);
    return response.data;
};

export const deleteType = async (id) => {
    const response = await axiosInstance.delete(`/type/${id}`);
    return response.data;
};
