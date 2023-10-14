import axios from 'axios';
import { AuthResponse } from '../models/response/AuthResponse';
import {API_URL} from '../services/APIURL';


const $api = axios.create({
    withCredentials: true,
    baseURL:API_URL
})

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config
})

// Второй интерцептор не проверен

$api.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && error.config && !error._isRetry) {
        originalRequest._isRetry = true;
        try {
            const response =  await axios.get<AuthResponse>(API_URL + 'users/refresh', {withCredentials: true});
            localStorage.setItem('token', response.data.accessToken);
            return $api.request(originalRequest);
        } catch (e) {
            console.log('isnt auth');
            // window.location.reload();
        }
    }
    throw error;
})

export default $api;