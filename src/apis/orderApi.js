import { axiosInstance } from "./apiConfig";

// Create a new order
export const createOrder = async (data) => {
    const response = await axiosInstance.post('/order', data);
    return response.data;
};

// Get all orders
export const getAllOrders = async () => {
    const response = await axiosInstance.get('/orders');
    return response.data;
};

// Get a specific order by ID
export const getOrderById = async (orderId) => {
    const response = await axiosInstance.get(`/orders/${orderId}`);
    return response.data;
};

// Update an order by ID
export const updateOrderById = async (orderId, data) => {
    const response = await axiosInstance.put(`/orders/${orderId}`, data);
    return response.data;
};

// Delete an order by ID
export const deleteOrderById = async (orderId) => {
    const response = await axiosInstance.delete(`/orders/${orderId}`);
    return response.data;
};

export const getAssignedTailor = async(tailorId)=>{
    const response = await axiosInstance.get(`/orders/tailor/${tailorId}`)
    return response.data
}

export const bulkUploadStudents = async(orderId,file)=>{
    const response = await axiosInstance.post(`/orders/${orderId}/excel-upload`,file)
    return response.data
}