import React, { useContext, useEffect, useRef } from "react";
import cl from './ContextMenu.module.css'
import { Context } from "../../..";

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import MessageService from "../../../services/MessageService";

import { WEBSOCKET_URL } from "../../../services/APIURL";

interface Props {
    messageId: number | null;
    chatId: number | null;
    authorId: string | null; 
    visible: boolean;
    setButtonVisible: React.Dispatch<React.SetStateAction<boolean>>; 
    setContextVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setInputVisible: React.Dispatch<React.SetStateAction<boolean>>;
    attachment: {
        id: number;
        attachment_name: string;
        attachment_size: number;
        attachment_path: string;
        attachment_type: number;
    } | null;
}

const ContextMenu: React.FC<Props> = (
    {
        messageId, 
        chatId,
        authorId, 
        visible, 
        setButtonVisible, 
        setContextVisible,
        setInputVisible,
        attachment
    }
    
    ) => {

    const {store} = useContext(Context);
    const socket = useRef<WebSocket | null>(null);

    const deleteMessage = () => {
        const deleteMessageRequest = async () => {
            await MessageService.deleteMessage(messageId);
        }

        socket.current = new WebSocket('ws://' + WEBSOCKET_URL + '/');

        deleteMessageRequest();
        setContextVisible(false);

        
        socket.current.onopen = () => {
            const message = {
                type: 'update',
                attributes: chatId
            }
        
            if (socket.current) {
                socket.current.send(JSON.stringify(message));
                socket.current.close();
            }
        }
    }

    return (
        <div className={visible ? [cl.context_menu, cl.active].join(' ') : cl.context_menu}>
            <button className={cl.delete_message_button} onClick={deleteMessage}> <DeleteIcon/> Delete </button>
            {authorId === store.user.id ?
                <button
                    className={cl.edit_message_button}
                    onClick={ () => { setInputVisible(true); attachment !== null ? setButtonVisible(true) : setButtonVisible(false); setContextVisible(false); } }
                > <EditIcon/> Edit </button>
                
                : null
            }
        </div>
    )
}

export default ContextMenu;