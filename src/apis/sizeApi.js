import { axiosInstance } from "./apiConfig";

// Create a new size
export const createSize = async (data) => {
    const response = await axiosInstance.post('/size', data);  // Correct endpoint for creating a size
    return response.data;
};

// Get all sizes
export const getAllSizes = async () => {
    const response = await axiosInstance.get('/sizes');  // Correct endpoint for fetching all sizes
    return response.data;
};

// Get a specific size by ID
export const getSize = async (id) => {
    const response = await axiosInstance.get(`/size/${id}`);  // Correct endpoint for fetching a specific size
    return response.data;
};

// Update a size by ID
export const updateSize = async (id, data) => {
    const response = await axiosInstance.put(`/size/${id}`, data);  // Correct endpoint for updating a size
    return response.data;
};

// Delete a size by ID
export const deleteSize = async (id) => {
    const response = await axiosInstance.delete(`/size/${id}`);  // Correct endpoint for deleting a size
    return response.data;
};

export const addMapBySize = async (id,data) => {
    const response = await axiosInstance.post(`/size/${id}/add-map`,data);
    return response.data;
};

export const removeMapBySize = async (id,mappingId) => {
    const response = await axiosInstance.post(`/size/${id}/remove-map/${mappingId}`);
    return response.data;
};