import React, {useContext, useEffect, useState} from 'react';
import cl from './ContactsModal.module.css';
import UserService from '../../../services/UserService';
import UserContact from '../UserContact/UserContact';
import { IUser } from '../../../models/IUser';
import AddInput from '../AddInput/AddInput';
import Button from '../Button/Button';
import AuthError from '../AuthError/AuthError';
import { Context } from '../../..';

interface Props {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ContactsModal: React.FC<Props> = ({visible, setVisible}) => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [errorVisible, setErrorVisible] = useState<boolean>(false);
    const [errorText, setErrorText] = useState<string>('Неизвестная ошибка');

    const {store} = useContext(Context);

    useEffect(() => {
        const usersFetch = async () => {
            let usersData = (await UserService.fetchUsers()).data;

            if (searchValue.length !== 0) {
                usersData = usersData.filter(item => item.username.includes(searchValue));
            }

            setUsers(usersData);
        }
        usersFetch();
    }, [searchValue])
    
    const selectUser = (username: string) => {
        setSelectedUser(username)
    }

    const addContact = () => {
        if (selectedUser.length === 0) {
            setErrorVisible(true);
            setErrorText('Вы не выбрали пользователя');
            setTimeout(() => {
                setErrorVisible(false)
                setErrorText('Неизвестная ошибка');
            }, 2000);
        } else {
            const addContactSend = async () => {
                try {
                    await UserService.addContanct(Number(store.user.id), selectedUser)
                    setVisible(false);
                    window.location.reload();
                    // Починить баг
                } catch (e) {
                    switch (e.response?.data.message) {
                        case 'u already have this user in ur contacts list':
                            setErrorText('В ваших контакт уже есть этот пользователь!'); break;
                        case 'u cant add urself in ur contacts list':
                            setErrorText('Вы не можете добавлять в контакты самого себя!'); break;
                    }
                    setErrorVisible(true);
                    setTimeout(() => { setErrorVisible(false); setErrorText('Неизвестная ошибка');}, 2000);
                    setTimeout(() => {
                        setVisible(false);
                    }, 2000)
                }
            }
            addContactSend();
        }
    }

    return (
        <div className = { visible ? [cl.root, cl.active].join(' ') : cl.root } onClick={() => setVisible(false)}>
            <AuthError visible={errorVisible} text = {errorText} />
            <div className = {cl.content} onClick={(e) => e.stopPropagation()}>
                <div className={cl.input_add}>
                    <AddInput callback={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}>Введи никнейм пользователя</AddInput>
                </div>
                <div className={cl.access_user}>
                    {
                        users.map((user, index) => (
                            <UserContact key = {index} callback = {selectUser} avatar = {user.photo} name = {user.name} username = {user.username}/>
                        ))
                    }
                </div>
                <div className={cl.add_section}>
                    <Button callback={addContact} >Добавить</Button>
                    <div className={cl.selected_value}>{  selectedUser.length === 0 ? 'Пользователь не выбран' : selectedUser }</div>
                </div>
            </div>
        </div>
    );
}

export default ContactsModal;