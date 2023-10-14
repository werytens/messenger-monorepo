import React, { useState, useEffect, useContext } from 'react';
import cl from './ChatList.module.css';
import Button from '../../UI/Button/Button';
import SearchInput from '../../UI/SearchInput/SearchInput';
import { Context } from '../../..';
import ChatButton from '../../UI/ChatButton/ChatButton';
import Chat from '../../UI/Chat/Chat';
import CreateChatModal from '../../UI/CreateChatModal/CreateChatModal';

import ChatService from '../../../services/ChatService';


interface StateChat {
    chatId: number;
    chatOwnerId: number;
    chatTargetId: number;
}


const ChatList: React.FC = () => {
    const {store} = useContext(Context);
    const [chats, setChats] = useState<StateChat[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');

    localStorage.setItem('lastpage', '2')

    useEffect(() => {
        const getChats = async () => {
            const result = await ChatService.getUserChats(store.user.id);
            setChats(result);
        }; getChats();
    }, [searchQuery])

    const shutter = () => {
        console.log(chats)
    }

    // Chat
    const [chatVisible, setChatVisible] = useState<boolean>(false);
    const [chatInfo, setChatInfo] = useState<[number, number, number]>([0, 0 ,0]);
    const [chatCreateModalVisible, setChatCreateModalVisible] = useState<boolean>(false);

    const openChat = (chatId: number, targetId: number) => {
        setChatVisible(false);
        setTimeout(() => {
            setChatInfo([chatId, targetId, Number(store.user.id)]);
            setChatVisible(true);
        }, 200)
    } 

    const createNewChat = () => {
        setChatCreateModalVisible(true);
    }

    return (
        <div className={cl.root}>

            <CreateChatModal callback={shutter} visible = {chatCreateModalVisible} setVisible = {setChatCreateModalVisible} />

            <div className={cl.chat_list}>
                <section className={cl.title_section}>
                    <div className={cl.title}>Chats</div>
                    <Button callback={createNewChat}>+ Create New Chat</Button>
                </section>
                <section className={cl.search_section}>
                    <SearchInput callback={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}>Search</SearchInput>  
                </section>
                <section className={cl.chat_section}>
                    {
                        chats.map((chat, index) => (
                            <ChatButton 
                                callback={openChat} 
                                key = {index} 
                                chatId = {chat.chatId} 
                                chatOwnerId = {chat.chatOwnerId} 
                                chatTargetId = {chat.chatTargetId} 
                                searchQuery = {searchQuery}
                            />
                        ))
                    }
                </section>
            </div>
            <div className={cl.chat}>
                <Chat 
                visible = {chatVisible} 
                chatInfo = {chatInfo}
                />
            </div>
        </div>
    )
}

export default ChatList;