import React from 'react';
import cl from './UserContact.module.css';
import Avatar from '../Avatar/Avatar';

interface Proprs {
    avatar: string;
    name: string;
    username: string;
    callback: (username: string) => void;
}

const UserContact: React.FC<Proprs> = ({callback, avatar, name, username}) => {
    return (
        <div className={cl.user} onClick={() => callback(username)}>
            <div className={cl.avatar_block}>
                <Avatar item = {avatar} size = {50}/>
            </div>
        <div className={cl.text_block}>
            <div className={cl.name}>{name}</div>
                <div className={cl.username}>{username}</div>
            </div>
        </div>
    )
}

export default UserContact;