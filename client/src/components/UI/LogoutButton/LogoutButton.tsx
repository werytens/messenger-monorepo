import React, { useContext } from 'react';
import cl from './LogoutButton.module.css';
import { Context } from '../../..';
import UserService from '../../../services/UserService';

interface PropsTypes {
    children: React.ReactNode;
    text: String;
    callback: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const LogoutButton: React.FC<PropsTypes> = ({callback, text, children = undefined}) => {

    const {store} = useContext(Context);

    const logOutFunction = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const setOnline = async () => {
            await UserService.setOnline(Number(store.user.id), false);
        } 
        setOnline();
        callback(e);
    }

    return (
        <button className={cl.button} onClick={logOutFunction}>
            {children !== undefined ? <div className={cl.emoji}>{children}</div> : null }
            <div className={cl.text}>
                {text}
            </div>
        </button>
    )
}

export default LogoutButton;