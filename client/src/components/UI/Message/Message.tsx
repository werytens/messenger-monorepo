import React, { useContext, useEffect, useState, useRef } from "react";
import cl from './Message.module.css';
import Avatar from "../Avatar/Avatar";


import MessageService from "../../../services/MessageService";
import Player from "../Player/Player";

import Attachment from "../Attachment/Attachment";
import ImageAttachment from "../ImageAttachment/ImageAttachment";
import ContextMenu from "../ContextMenu/ContextMenu";
import { WEBSOCKET_URL } from "../../../services/APIURL";

interface Props {
    id: number | null;
    checked: boolean | null;
    name: string | null;
    avatar: string;
    children: string | null;
    callback: () => void;
    authorId: string | null;
    attachment_id: number | null;
    chat_id: number | null;
    createdAt: string;
}

interface Attachment {
    id: number;
    attachment_name: string;
    attachment_size: number;
    attachment_path: string;
    attachment_type: number;
}


const Message: React.FC<Props> = ({id, checked, name, avatar, children, callback, authorId, attachment_id, chat_id, createdAt}) => {
    const socket = useRef<WebSocket | null>(null);
    const [contextVisible, setContextVisible] = useState<boolean>(false);
    const [inputVisible, setInputVisible] = useState<boolean>(false);
    const [buttonVisible, setButtonVisible] = useState<boolean>(false);
    const [newText, setNewText] = useState<string>(String(children));

    const [attachmentId, setAttachmentId] = useState<number | null | string>(attachment_id);
    const [attachment, setAttachment] = useState<Attachment | null>(null);

    const monthNames = [
        "января", "февраля", "марта", "апреля", "мая", "июня",
        "июля", "августа", "сентября", "октября", "ноября", "декабря"
    ];

    const handleContext = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();

        if (contextVisible) {
            setContextVisible(false);
        } else {
            setContextVisible(true);
        }
    }

    useEffect(() => {
        if (attachmentId !== null && attachmentId !== null) {
            const setAttachmentToState = async () => {
                const response = await MessageService.getAttachment(attachmentId);

                if (response.data.attachment_path.length !== 0) {
                    const resultOfResponse = [response.data].map((item: Attachment&{attachment_type_id: number}) => (
                        {
                            attachment_name: item.attachment_name,
                            attachment_size: item.attachment_size,
                            id: item.id,
                            attachment_path: item.attachment_path,
                            attachment_type: item.attachment_type_id
                        }
                    ));

                    setAttachment(resultOfResponse[0]);
                }
            }

            setAttachmentToState();
        }
    }, [attachmentId]);

    const editMessage = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {       
            socket.current = new WebSocket('ws://' + WEBSOCKET_URL + '/');

            const editMessageRequest = async () => {
                await MessageService.editMessage(id, newText);
            }

            editMessageRequest();
            setInputVisible(false);
            setButtonVisible(false);

            socket.current.onopen = () => {
                const message = {
                    type: 'update',
                    attributes: chat_id
                }
            
                if (socket.current) {
                    socket.current.send(JSON.stringify(message));
                    socket.current.close();
                }
            }
        }
    }

    const deleteAttachment = async () => {
        socket.current = new WebSocket('ws://' + WEBSOCKET_URL + '/');

        await MessageService.deleteAttachment(id, Number(attachmentId))
    
        setAttachmentId(null);
        setInputVisible(false);
        setButtonVisible(false);

        
        socket.current.onopen = () => {
            const message = {
                type: 'update',
                attributes: chat_id
            }
        
            if (socket.current) {
                socket.current.send(JSON.stringify(message));
                socket.current.close();
            }
        }
    }

    return (
        <div 
            className={!checked ? [cl.message, cl.unactive].join(' ') : cl.message} 
            onContextMenu={handleContext}
            onClick={() => {console.log(id)}}
        >
            <div className={cl.avatar_block}>
                <Avatar item = {avatar} size = {46} />
            </div>
            <div className={cl.text_block}>
                
                <div className={cl.name}>
                    {name} 
                    <span className={cl.message_time}>
                        {String(new Date(createdAt).getDate())} {monthNames[Number(new Date(createdAt).getMonth())]}
                        <b> </b>
                        <b> </b>{String(new Date(createdAt).getHours()).length === 1 ? '0' + String(new Date(createdAt).getHours()) : String(new Date(createdAt).getHours())} 
                        : 
                        {String(new Date(createdAt).getMinutes()).length === 1 ? '0' + String(new Date(createdAt).getMinutes()) : String(new Date(createdAt).getMinutes())}
                    </span>
                </div>
                
                <div
                    className={inputVisible ? [cl.content, cl.unactive_content].join(' ') : cl.content}
                >
                    {children}
                    {attachment !== null && attachmentId !== null ?

                        <div className={cl.attachment}>

                            {
                                attachment.attachment_type === 0 ?
                                <ImageAttachment name = {attachment.attachment_name} attachment_id={attachment_id} />
                                : attachment.attachment_type === 1 ? 
                                <Player attachment_id={attachment_id} />
                                : attachment.attachment_type === 2 ? 
                                <Attachment size = {attachment.attachment_size} name = {attachment.attachment_name} attachment_id = {attachment_id} /> 
                                : null
                            }

                        </div>

                    : null}
                </div>
                <div className={cl.input}>
                    <input
                        className={inputVisible ? [cl.change_input, cl.active_input].join(' ') : cl.change_input}
                        type="text"
                        value={newText}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewText(e.target.value)}
                        onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => editMessage(e)}
                    />
                </div>
                <div className={cl.delete_attachment}>
                    <button
                        className={buttonVisible ? [cl.att_del, cl.active_input].join(" ") : cl.att_del}
                        onClick={deleteAttachment}
                    >
                        Открепить вложение
                    </button>
                </div>

                <ContextMenu 
                    messageId={id} 
                    chatId={chat_id}
                    authorId={authorId} 
                    visible={contextVisible} 
                    setButtonVisible={setButtonVisible} 
                    setContextVisible={setContextVisible} 
                    setInputVisible={setInputVisible}
                    attachment={attachment}
                />
            </div>
        </div>
    )
}

export default Message;