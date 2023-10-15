import axios from "axios";
import { IMessage } from "../models/IMessage";
import { IAttachment } from "../models/IAttachment";
import {API_URL} from "./APIURL";

export default class MessageService {
    static async getNextMessageId() {
        try {
            return (await axios.get(API_URL + 'messages/nextid')).data
        } catch (error) {
            console.error("Ошибка при получении следующего идентификатора:", error);
            throw error;
        }
    }

    static async makeChecked(ids: number[]) {
        try {
            // await axios.post(API_URL + 'messages/makeChecked', {
                // ids
            // })
            await axios.put(API_URL + 'messages/makeChecked', {data: {ids}})
        } catch (e) {
            console.error('Error in makeChecked: ', e);
            throw e;
        }
    }

    static async getMessagesByChatId(id: number) {
        try {
            return (await axios.get(API_URL + 'messages/get/' + id)).data;
        } catch (e) {
            console.error('Error in getMessagesByChatId: ', e);
            throw e;
        }
    }

    static async send(message: IMessage) {
        try {
            await axios.post(API_URL + 'messages/send', message)
        } catch (e) {
            console.error('Error in getMessagesByChatId: ', e);
            throw e;
        }
    }

    static async addAttachment(attachment: IAttachment) {
        try {
            await axios.post(API_URL + 'messages/addAttachment', {
                id: attachment.id,
                type: attachment.attachmentType,
                name: attachment.attachmentName,
                path: attachment.attachmentPath,
                size: attachment.attachmentSize
            })
        } catch (e) {
            console.error('Error in getMessagesByChatId: ', e);
            throw e;
        }
    }

    static async getLast(id: number) {
        try {
            return await axios.get(API_URL + 'messages/getLast/' + id);
        } catch (e) {
            console.error('Error in getMessagesByChatId: ', e);
            throw e;
        }
    }

    static async getUnchecked(id: number) {
        try {
            return (await axios.get(API_URL + 'messages/getUnchecked/' + id)).data;
        } catch (e) {
            console.error('Error in getMessagesByChatId: ', e);
            throw e;
        }
    }

    
    static async getAttachment(id: string | number) {
        try {
            return await axios.get(API_URL + 'messages/getAttachment/' + id)
        } catch (e) {
            console.error('Error in getAttachment: ', e);
            throw e;
        }
    }

    static async deleteMessage(id: number | null) {
        try {
            await axios.delete(API_URL + 'messages/delete', { data: { id }})
        } catch (e) {
            console.error("er in deletemsg: ", e);
            throw e;
        }
    }

    static async editMessage(id: number | null, content: string) {
        try {
            await axios.put(API_URL + 'messages/edit', { data: { id, content }})
        } catch (e) {
            console.error("er in editmsg: ", e);
            throw e;
        }
    }

    static async deleteAttachment(messageId: number | null, attachmentId: number | null) {
        try {
            await axios.delete(API_URL + 'messages/deleteAttachment', {data: { messageId, attachmentId }});
        } catch (e) {
            console.error("er in delete: ", e);
            throw e;
        }
    }
}