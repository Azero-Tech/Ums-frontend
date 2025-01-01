import { axiosInstance } from "./apiConfig";

// Create a new branch
export const createBranch = async (data) => {
    const response = await axiosInstance.post('/branch', data);  // Correct endpoint for creating a branch
    return response.data;
};

// Get all branches
export const getAllBranches = async () => {
    const response = await axiosInstance.get('/branches');  // Correct endpoint for fetching all branches
    return response.data;
};

// Get a specific branch by ID
export const getBranch = async (id) => {
    const response = await axiosInstance.get(`/branch/${id}`);  // Correct endpoint for fetching a specific branch
    return response.data;
};

// Update a branch by ID
export const updateBranch = async (id, data) => {
    const response = await axiosInstance.put(`/branch/${id}`, data);  // Correct endpoint for updating a branch
    return response.data;
};

// Delete a branch by ID
export const deleteBranch = async (id) => {
    const response = await axiosInstance.delete(`/branch/${id}`);  // Correct endpoint for deleting a branch
    return response.data;
};

export const getBranchByIndustries = async (id) => {
    const response = await axiosInstance.get(`/branches/industry/${id}`);  // Correct endpoint for deleting a branch
    return response.data;
};