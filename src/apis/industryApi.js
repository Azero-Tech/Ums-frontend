import { axiosInstance } from "./apiConfig";

// Create a new industry
export const createIndustry = async (data) => {
    const response = await axiosInstance.post('/industry', data);
    return response.data;
};

// Get all industries
export const getAllIndustries = async () => {
    const response = await axiosInstance.get('/industrys');
    return response.data;
};

// Get a specific industry by ID
export const getIndustry = async (id) => {
    const response = await axiosInstance.get(`/industry/${id}`);
    return response.data;
};

// Update an industry by ID
export const updateIndustry = async (id, data) => {
    const response = await axiosInstance.put(`/industry/${id}`, data);
    return response.data;
};

// Delete an industry by ID
export const deleteIndustry = async (id) => {
    const response = await axiosInstance.delete(`/industry/${id}`);
    return response.data;
};

export const getIndustriesByType = async (id) => {
    const response = await axiosInstance.get(`/industrys/${id}`);
    return response.data;
};
