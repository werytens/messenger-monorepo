import React, { useContext, useEffect, useState, useRef } from "react";
import cl from './Chat.module.css';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import SettingsIcon from '@mui/icons-material/Settings';
import ChatMenuButton from "../ChatMenuButton/ChatMenuButton";
import Message from "../Message/Message";
import { Context } from "../../..";
import Avatar from "../Avatar/Avatar";

import MessageService from "../../../services/MessageService";
import UserService from "../../../services/UserService";
import { IMessage } from "../../../models/IMessage";
import { IAttachment } from "../../../models/IAttachment";
import FileService from "../../../services/FileService";
import { WEBSOCKET_URL } from "../../../services/APIURL";

interface Props {
    visible: boolean;
    chatInfo: [number, number, number]
}

interface User {
    id: number | null;
    name: string | null;
    online: boolean | null;
    avatar: string;
}

interface Message {
    id: number | null;
    content: string | null;
    author_id: string | null;
    checked: boolean | null;
    attachment_id: number | null;
    createdAt: string;
}

const setOnline = async (id: number, status: boolean) => {
    await UserService.setOnline(id, status);
} 

const Chat: React.FC<Props> = ({visible, chatInfo}) => {
    const {store} = useContext(Context);
    const [targetUser, setTargetUser] = useState<User>({id: 0, name: '', online: null, avatar: ''});
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessageText, setNewMessageText] = useState<string>('');
    const [isTargetOnline, setIsTargetOnline] = useState<boolean>(false);
    const divRef = useRef<HTMLDivElement>(null);
    const sendRef = useRef<HTMLInputElement>(null);
    const socket = useRef<WebSocket | null>(null);

    const [fileModalVisibe, setFileModalVisible] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            e.target.files = null;
        }
    };

    const getAllMessages = async () => {
        const messages = await MessageService.getMessagesByChatId(chatInfo[0]);
        setMessages(messages.map((item: IMessage) => {
                return {
                    id: item.id,
                    content: item.content,
                    author_id: item.author_id,
                    checked: Number(item.author_id) !== Number(store.user.id) ? true : item.checked,
                    attachment_id: item.attachment_id,
                    createdAt: item.createdAt
                }
            }
        ))

        const unCheckedIds = messages.filter(
            (item: { checked: boolean, author_id: string }) => 
            item.checked !== true && item.author_id != store.user.id).map((item: {id: number}) => item.id);

        await MessageService.makeChecked(unCheckedIds);
                
        setTimeout(() => {
            if (divRef.current) {
                divRef.current.scrollTop = divRef.current.scrollHeight
            }
        }, 100)
    }
    
    const getTargetUser = async () => {
        const response = await UserService.getUserById(chatInfo[1]);

        setTargetUser({
            id: response.data.id,
            name: response.data.name + " " + response.data.surname,
            online: response.data.online,
            avatar: response.data.photo
        })

        if (response.data.online === true) {
            setIsTargetOnline(true);
        }
    }

    const getOneMessage = (newMessage: any) => {
        if (newMessage.author_id != store.user.id) {
            newMessage.checked = isTargetOnline ? true : false
            MessageService.makeChecked([newMessage.id]);
        }
        setMessages(prevMessages => [...prevMessages, newMessage]);
    }

    const saveOneMessage = async (message: IMessage) => {
        await MessageService.send(message);
        getAllMessages();
    }

    const sendMessage = async () => {

        let attachment: IAttachment = {id: null, attachmentName: '', attachmentType: '', attachmentPath: '', attachmentSize: 0};
        
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            const responseData = await FileService.uploadFile(formData);
                    
            attachment.attachmentName = selectedFile.name;
            attachment.attachmentType = selectedFile.type;
            attachment.attachmentSize = selectedFile.size;
            attachment.attachmentPath = responseData.data.filePath;
            attachment.id = responseData.data.id;

            if (responseData.data.id !== null ) {
                await MessageService.addAttachment(attachment);
            }
        }

        setNewMessageText('');

        const message: IMessage = {
            chat_id: chatInfo[0],
            author_id: Number(store.user.id),
            content: newMessageText,
            checked: false,
            attachment_id: attachment.id,
            id: await MessageService.getNextMessageId(),
            createdAt: String(new Date())
        }


        attachment = { id: null, attachmentName: '', attachmentType: '', attachmentPath: '', attachmentSize: 0 };
        setSelectedFile(null);
        saveOneMessage(message);

        if (socket.current) {
            socket.current.send(JSON.stringify(message));
        }

        setTimeout(() => {
            if (divRef.current) {
                divRef.current.scrollTop = (divRef.current.scrollHeight * 2)
            }    
        }, 100)
    }
    
    useEffect(() => {

        if (!visible) {
            socket.current?.close();
        }

        if (visible) {
            getTargetUser();
            getAllMessages();

            setTimeout(() => {

                if (socket.current) {
                    socket.current.close();
                }

                socket.current = new WebSocket('ws://' + WEBSOCKET_URL + '/');

                socket.current.onopen = () => {
                    setOnline(Number(store.user.id), true);

                    // Для того, чтобы у пользователя отобразило, что его сообщения были прочитаны
                    const messageToUpdate = {
                        type: 'check',
                        attributes: [chatInfo[0], store.user.id]
                    }
                
                    if (socket.current) {
                        socket.current.send(JSON.stringify(messageToUpdate));
                    }
                }

                socket.current.onclose = () => {
                    const messageToUpdate = {
                        type: 'uncheck',
                        attributes: [chatInfo[0], store.user.id]
                    }
                
                    if (socket.current) {
                        socket.current.send(JSON.stringify(messageToUpdate));
                    }

                    console.log('Вы успешно отклюичились от вебсокета.')
                    setOnline(Number(store.user.id), false);
                }

                socket.current.onmessage = (event) => {
                    const receivedMessage = JSON.parse(event.data);

                    console.log(receivedMessage)
                    
                    if (receivedMessage.type === 'update' && receivedMessage.attributes === chatInfo[0]) {
                        setTimeout(() => {
                            getAllMessages();
                        }, 10)
                    } 
                    
                    if (receivedMessage.type === 'check' && receivedMessage.attributes[0] === chatInfo[0] && receivedMessage.attributes[1] !== store.user.id) {
                        setTimeout(() => {
                            getAllMessages();
                            setIsTargetOnline(true);
                        }, 10)

                    } 

                    if (receivedMessage.type === 'uncheck' && receivedMessage.attributes === chatInfo[0] && receivedMessage.attributes[1] !== store.user.id) {                        
                        setTimeout(() => {                        
                            setIsTargetOnline(false);
                        }, 10)
                    } 

                    if (receivedMessage.author_id) {
                        setTimeout(() => {
                            getOneMessage(receivedMessage);
                            if (divRef.current) {
                                divRef.current.scrollTop = divRef.current.scrollHeight
                            }    
                        }, 10)
                    }
                    
                }
                
            }, 100);
        }

    }, [visible])

    const shutter = () => {
        console.log(1)
    }

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleSendMessage = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            if (sendRef.current) {
                sendRef.current.click()
            }
        }
    }

    return (
        <div className={visible ? [cl.chat, cl.active_chat].join(" ") : cl.chat}>
            <div className={cl.chat_navbar}>
                <div className={cl.left_navbar_side}>
                    <Avatar item = {targetUser.avatar} size = {56}/>
                    <div className={cl.text_block}>
                        <div className={cl.name_block}>
                            {targetUser.name}
                        </div>
                        <div className={cl.status_block}>
                            {isTargetOnline ? "online" : "offline" }
                        </div>
                    </div>
                </div>
                <div className={cl.right_navbar_side}>
                    <ChatMenuButton callback={shutter} ><SettingsIcon/></ChatMenuButton>
                </div>
            </div>

            <div className={cl.chat_bar} ref={divRef}>
                {
                    messages.map((message, index) => (
                        <Message
                            id = {message.id}
                            key = {index + 1}
                            name = {message.author_id === store.user.id ? store.user.name + " " + store.user.surname : targetUser.name}
                            avatar = {message.author_id === store.user.id ? store.user.photo : targetUser.avatar}
                            callback={shutter}
                            checked = {message.checked}
                            authorId = {message.author_id}
                            attachment_id = {message.attachment_id}
                            chat_id={chatInfo[0]}
                            createdAt = {message.createdAt}
                        >
                            {message.content}
                        </Message>
                    ))
                }
            </div>

            <div className={cl.chat_messagesend_bar}>
                
                <div className={cl.input_block}>
                    <textarea 
                        value = {newMessageText}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewMessageText(e.target.value)} 
                        className={cl.input} 
                        placeholder="type a message here" 
                        onKeyPress={handleSendMessage}
                    />
                </div>
                <div className={cl.buttons_block}>
                    <div className = {cl.chat_buttons}>
                        <ChatMenuButton callback={shutter}><EmojiEmotionsIcon/></ChatMenuButton>
                        <ChatMenuButton callback={handleButtonClick}><AttachFileIcon/></ChatMenuButton>
                        <ChatMenuButton callback={sendMessage} reference={sendRef}><SendIcon/></ChatMenuButton>
                    </div>
                    <div className={cl.selected_file}>
                        {!selectedFile ? '' : selectedFile.name}
                    </div>
                </div>
                <input
                    className={cl.file_select}
                    type="file"
                    onChange={handleFileChange}
                    onClick={(event: React.MouseEvent<HTMLInputElement, MouseEvent>) => event.stopPropagation()}
                    ref={fileInputRef}
                />
            </div>
        </div>
    )
}

export default Chat;
