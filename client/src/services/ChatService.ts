import axios from "axios";
import { AxiosResponse } from 'axios';
import { IChat } from "../models/IChats";
import {API_URL} from "./APIURL";

export default class ChatService {
    static async getUserChats(userId: string) {
        try {
            const response = await axios.get(API_URL + 'chats/get/' + userId);
            const array: IChat[] = response.data.chats;
            return array.map(item => ({
                chatId: item.id,
                chatOwnerId: item.owner_id,
                chatTargetId: item.target_id
            }));
        } catch (error) {
            console.error("Ошибка при получении чатов пользователя:", error);
            throw error;
        }
    }

    static async getUserChatsWithoutDto(userId: string) {
        try {
            const response = await axios.get(API_URL + 'chats/get/' + userId);
            return response.data.chats
        } catch (error) {
            console.error("Ошибка при получении чатов пользователя:", error);
            throw error;
        }
    }
    

    static async createChat(id: number, targetId: number) {
        try {
            await axios.post(API_URL + 'chats/create/', { id, targetId })
        } catch (error) {
            console.error("Error in createChat: ", error);
            throw error;
        }
    }
    
}