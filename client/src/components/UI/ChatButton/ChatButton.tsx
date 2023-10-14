import React, { useState, useEffect, useContext, useRef } from 'react';
import cl from './ChatButton.module.css'
import { Context } from '../../..';
import Avatar from '../Avatar/Avatar';
import UserService from '../../../services/UserService';
import MessageService from '../../../services/MessageService';
import { WEBSOCKET_URL } from '../../../services/APIURL';

interface Props {
    chatId: number;
    chatOwnerId: number;
    chatTargetId: number;
    callback: (chatId: number, targetId: number) => void;
    searchQuery: string;
}

interface User {
    name: string;
    online: boolean | null;
    photo: string;
}

const ChatButton: React.FC<Props> = ({chatId, chatOwnerId, chatTargetId, callback, searchQuery}) => {
    const [targetUser, setTargetUser] = useState<User>({name: '0', online: null, photo: ''});
    const [lastMessage, setLastMessage] = useState<string>('');
    const {store} = useContext(Context);
    const [isTargetOnline, setIsTargetOnline] = useState<boolean>(false);

    const [searchText, setSearchText] = useState(searchQuery);

    const [targetUserId, setTargetUserId] = useState<number>(chatOwnerId);
    const socket = useRef<WebSocket | null>(null);

    useEffect(() => {
        const getUser = async () => {
            let targetId: number = chatTargetId;
            if (targetId === Number(store.user.id)) {
                targetId = chatOwnerId;
            }

            setTargetUserId(targetId);

            const targetUserResponse = await UserService.getUserById(targetId);
            if (targetUserResponse.data.online == true) {
                setIsTargetOnline(true)
            }
            setTargetUser({
                name: targetUserResponse.data.name + " " + targetUserResponse.data.surname,
                online: isTargetOnline,
                photo: targetUserResponse.data.photo
            });
        }

        const getLastMessage = async () => {
            setTimeout(async () => {
                const lastMessage = await MessageService.getLast(chatId);
                let content = 'В этом чате ещё нет сообщений.' 

                if (lastMessage.data !== null) {
                    content = lastMessage.data.content;
                }
                setLastMessage(content);
            }, 50)
        }

        getUser();
        getLastMessage();

        socket.current = new WebSocket('ws://' + WEBSOCKET_URL + '/');

        socket.current.onmessage = (event) => {
            const receivedMessage = JSON.parse(event.data);
            if (receivedMessage.type === 'check' && receivedMessage.attributes === chatId) {
                setIsTargetOnline(true);
            } else if (receivedMessage.type === 'uncheck' && receivedMessage.attributes === chatId) {
                setIsTargetOnline(false);
            } else {
                getLastMessage();
            }
        }

        setSearchText(searchQuery);
    }, [searchQuery])


    return (
        <div 
            className={cl.button} 
            onClick={() => callback(chatId, targetUserId)}
            style={targetUser.name.includes(searchText) ? {display: 'block'} : {display: 'none'}}
        >
            <div className={cl.header}>
                <div className={cl.left_header_side}>
                    <Avatar item = {targetUser.photo} size = {50}/>
                    <div className={cl.name_block}>{targetUser.name}</div>
                </div>
                <div className={cl.right_header_side}>
                    <div className={cl.status_block}>
                        {
                            targetUser.online ? "online" : "offline"
                        }
                    </div>
                </div>
            </div>
            <div className={cl.last_message}>
                {lastMessage}
            </div>
        </div>
    )
}


export default ChatButton;