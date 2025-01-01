import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL : `${process.env.REACT_APP_BASEURL}/api/v1` || "",
    withCredentials : true
})
