import React, { useContext, useState } from 'react';
import cl from './CreateChatModal.module.css';
import AddInput from '../AddInput/AddInput';
import Button from '../Button/Button';
import { Context } from '../../..';
import UserService from '../../../services/UserService';
import ChatService from '../../../services/ChatService';

interface Props {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    callback: () => void;
}

const CreateChatModal: React.FC<Props> = ({visible, setVisible, callback}) => {
    const [usernameToCreate, setUsernameToCreate] = useState<string>('');
    const {store} = useContext(Context);

    const createChat = () => {
        const createChatRun = async () => {
            await ChatService.createChat(Number(store.user.id), await UserService.getByUsername(usernameToCreate))
            window.location.reload();
        }; createChatRun();
    }

    return (
        <div
        className={visible ? [cl.modal, cl.active].join(" ") : cl.modal}
        onClick={() => setVisible(false)}
        >
            <div className={cl.content} onClick={(e) => e.stopPropagation()} >
                <div className={cl.input_add}>
                    <AddInput callback={(e: React.ChangeEvent<HTMLInputElement>) => {setUsernameToCreate(e.target.value)}}>Введите никнейм пользователя</AddInput>
                </div>
                <div className={cl.button_add}>
                    <Button callback={createChat}>Добавить</Button>
                </div>
            </div>
        </div>
    )
}


export default CreateChatModal;
