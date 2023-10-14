import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../..';
import cl from './Notifications.module.css';
import Avatar from '../../UI/Avatar/Avatar';
import ChatService from '../../../services/ChatService';
import MessageService from '../../../services/MessageService';
import UserService from '../../../services/UserService';

interface User {
    name: string;
    avatar: string;
}

interface Notification {
    author_id: number;
    count: number;
    user: User;
}

const Notifications: React.FC = () => {

    localStorage.setItem('lastpage', '4')

    const {store} = useContext(Context);
    const [messages, setMessages] = useState<Notification[]>([]);

    useEffect(() => {

        const getMessage = async () => {
            const response = await ChatService.getUserChatsWithoutDto(store.user.id);
            const chatIds = [...response].map((chat: {id: number}) => chat.id);

            const messagesArray: Notification[] = [];

            for (const id of chatIds) {
                const responseMessages = await MessageService.getUnchecked(id);
                const notUserMessages = responseMessages.filter((message: {author_id: number}) => Number(message.author_id) !== Number(store.user.id));

                if (notUserMessages.length !== 0) {

                    const userRes = await UserService.getUserById(notUserMessages[0].author_id)

                    messagesArray.push({
                        author_id: notUserMessages[0].author_id,
                        count: notUserMessages.length,
                        user: {
                            name: userRes.data.name + " " + userRes.data.surname,
                            avatar: userRes.data.photo
                        }
                    });
                }
            }

            setMessages(messagesArray);
        }
        getMessage();
    }, []);

    return (
        <div className={cl.root}>
            <div className={cl.content}>
                {
                    messages.length === 0 ? 'У вас нет непрочитанных сообщений.' :
                    messages.map((item, index) => (
                        <div key={index} className={cl.user}> 
                            <Avatar item = {item.user.avatar} size = {48}/>
                            <div className={cl.text}>
                                {item.user.name}, {item.count} непрочитанных.
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default Notifications;