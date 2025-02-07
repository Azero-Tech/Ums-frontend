import { axiosInstance } from "./apiConfig";

export const getStudentsToOrder = async (orderId) => {
    const response = await axiosInstance.get(`/orders/${orderId}/students`);
    return response.data;
};

// Add a student to an order
export const addStudentToOrder = async (orderId, data) => {
    const response = await axiosInstance.post(`/orders/${orderId}/students`, data);
    return response.data;
};

// Update a student in an order
export const updateStudentInOrder = async (orderId, studentId, data) => {
    const response = await axiosInstance.put(`/orders/${orderId}/students/${studentId}`, data);
    return response.data;
};

export const updateStudentProducts = async (orderId, studentId, data) => {
    const response = await axiosInstance.patch(`/orders/${orderId}/students/${studentId}/product`, data);
    return response.data;
};

// Remove a student from an order
export const removeStudentFromOrder = async (orderId, studentId) => {
    const response = await axiosInstance.delete(`/orders/${orderId}/students/${studentId}`);
    return response.data;
};
