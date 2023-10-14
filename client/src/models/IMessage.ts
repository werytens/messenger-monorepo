export interface IMessage {
    chat_id: number;
    author_id: number;
    content: string;
    checked: boolean;
    attachment_id: number | null;
    id: number;
    createdAt: string;
}
