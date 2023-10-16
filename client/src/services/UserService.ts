import $api from '../http/index'
import {AxiosResponse} from 'axios';
import { IUser } from '../models/IUser';
import axios from 'axios';
import {API_URL} from './APIURL';

export default class UserService {
    static fetchUsers(): Promise<AxiosResponse<IUser[]>> {
        return $api.get<IUser[]>(API_URL + 'users/get')
    }
    
    static async getUserById(id: number) {
        try {
            return await axios.get(API_URL + 'users/getById/' + id);
        } catch (e) {
            console.error('Error in getUserById: ', e);
            throw e;
        }
    }

    static async setOnline(id: number, online: boolean) {
        try {
            await axios.put(API_URL + 'users/setOnlineStatus', {data: {
                user_id: id,
                online: online
            }})
        } catch (e) {
            console.error('Error in setOnline: ', e);
            throw e;
        }
    }

    // await axios.post(API_URL + 'users/setOnlineStatus', {
    //     user_id: store.user.id,
    //     online: true
    // })
    // await axios.post(API_URL + 'users/setOnlineStatus', {
    //     user_id: store.user.id,
    //     online: false
    // })

    static async addContanct(id: number, name: string) {
        try {
            return await axios.post(API_URL + 'users/addContact', {
                userId: id, 
                targetUsername: name
            });
        } catch (e) {
            console.error('Error in addContanct: ', e);
            throw e;
        }
    }

    static async getContancts(id: number) {
        try {
            return await axios.get<{ contact_id: number }[]>(API_URL + 'users/getContacts/' + id);
        } catch (e) {
            console.error('error in getContancts', e)
            throw e;
        }
    }

    static async ChangeAvatar(id: number, url: string) {
        try {
            // await axios.post(API_URL + 'users/changeAvatar', {
            //     id: id,
            //     avatarLink: url
            // })

            await axios.put(API_URL + 'users/changeAvatar', {data: {
                id: id,
                avatarLink: url
            }})
        } catch (e) {
            console.error('error in ChangeAvatar', e)
            throw e;
        }
    }

    static async ChangeNameAndSurname(id: number, name: string, surname: string) {
        try {
            // await axios.post(API_URL + 'users/changeNS', {
            //     id: id,
            //     name, surname
            // })

            await axios.put(API_URL + 'users/changeNS', {data: {
                id: id,
                name, surname
            }})
        } catch (e) {
            console.error('error in ChangeNameAndSurname', e)
            throw e;
        }
    }

    static async ChangeEmail(id: number, email: string) {
        try {
            // await axios.post(API_URL + 'users/changeEmail', {
            //     id: id,
            //     email
            // })

            await axios.put(API_URL + 'users/changeEmail', {data: {
                id: id,
                email
            }})

        } catch (e) {
            console.error('error in ChangeEmail', e)
            throw e;
        }
    }
    

    static async getByUsername(username: string) {
        try {
            return Number((await axios.get(API_URL + 'users/getByUsername/' + username)).data.id);
        } catch (e) {
            console.error('Error in getUserById: ', e);
            throw e;
        }
    }
}