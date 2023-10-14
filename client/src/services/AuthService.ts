import $api from '../http'
import {AxiosResponse} from 'axios';
import { AuthResponse } from '../models/response/AuthResponse';
import {API_URL} from "./APIURL";


export default class AuthService {
    static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>(API_URL + 'users/login', {email, password});
    }
    
    static async registration(name: string, surname: string, username: string, email: string, password: string, number: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>(API_URL + 'users/registration', {name, surname, username, email, password, number});
    }
    
    static async logout(): Promise<void> {
        return $api.post(API_URL + 'users/logout');
    }    
}