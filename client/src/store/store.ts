import { makeAutoObservable } from "mobx";
import { IUser } from "../models/IUser";
import AuthService from "../services/AuthService";
import axios from "axios";
import { AuthResponse } from "../models/response/AuthResponse";
import {API_URL} from "../services/APIURL";

export default class Store {
    user = {} as IUser;
    isAuth = false;
    isLoading = false;
    
    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    setLoading(bool: boolean) {
        this.isLoading = bool;
    }
 

    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password);
            console.log(response)
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
            await this.checkAuth();
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async registration(name: string, surname: string, username: string, email: string, password: string, number: string) {
        try {
            const response = await AuthService.registration(name, surname, username, email, password, number);
            console.log(response)
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
            await this.checkAuth();
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }
    
    async logout() {
        try {
            const response = await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({} as IUser);
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios.get<AuthResponse>(API_URL + 'users/refresh', {withCredentials: true})
            localStorage.setItem('token', response.data.refreshToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {} finally {
            this.setLoading(false);
        }
    }

    
}