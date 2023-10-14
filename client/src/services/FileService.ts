import axios from "axios";
import { IMessage } from "../models/IMessage";
import { IAttachment } from "../models/IAttachment";
import {API_URL} from "./APIURL";

export default class FileService {
    static async getFile(id: string | number) {
        try {
            return await axios.get(API_URL + 'files/download/' + id, {
                responseType: 'blob',
            });
        } catch (e) {
            console.error('error in getFile: ', e);
            throw e;
        }
    }

    static async uploadFile(formData: any) {
        try {
            const responseData = await axios.post<{id: number, filePath: string}>(API_URL + 'files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return responseData;
        } catch (e) {
            console.error('Error in getMessagesByChatId: ', e);
            throw e;
        }
    }
}