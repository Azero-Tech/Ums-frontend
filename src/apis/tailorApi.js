import { axiosInstance } from "./apiConfig"

export const createTailor = async(data)=>{
    const response = await axiosInstance.post('/tailor',data)
    return response.data
} 

export const getAllTailors = async()=>{
    const response = await axiosInstance.get('/tailors')
    return response.data
} 

export const getTailor = async(id)=>{
    const response = await axiosInstance.get(`/tailor/${id}`)
    return response.data
} 

export const updateTailor = async(id,data)=>{
    const response = await axiosInstance.put(`/tailor/${id}`,data)
    return response.data
} 

export const deleteTailor = async(id)=>{
    const response = await axiosInstance.delete(`/tailor/${id}`)
    return response.data
} 

