import { axiosInstance } from "./apiConfig"

export const login = async(data)=>{
    const response = await axiosInstance.post('/login',data)
    return response.data
}

export const resetPassword = async(data)=>{
    const response = await axiosInstance.post('/reset-password',data)
    return response.data
}

export const getTailorByToken = async()=>{
    const response = await axiosInstance.get('/tailor-token')
    return response.data
}

export const logout = async(data)=>{
    const response = await axiosInstance.post('/logout',data)
    return response.data
}