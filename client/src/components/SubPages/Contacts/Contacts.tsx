import React, {useContext, useEffect, useState} from 'react';
import cl from './Contacts.module.css'
import Button from '../../UI/Button/Button';
import UserContact from '../../UI/UserContact/UserContact';
import ContactsModal from '../../UI/ContactsModal/ContactsModal';
import { Context } from '../../..';
import UserService from '../../../services/UserService';

interface User {
    name: string;
    username: string;
    avatar: string;
}

const Contacts: React.FC = () => {
    const [contacts, setContacts] = useState<User[]>([])
    const [modalVisibe, setModalVisible] = useState(false);

    const {store} = useContext(Context);

    const runModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setModalVisible(true);
    }

    useEffect(() => {
        const addContact = async () => {
            const contactsUsers = [];

            const response = await UserService.getContancts(Number(store.user.id));
            const usersIds = response.data.map(user => user.contact_id);

            const userResponses = await Promise.all(usersIds.map(async userId => await UserService.getUserById(userId)));

        localStorage.setItem('lastpage', '3')

            contactsUsers.push(
                ...userResponses.map(item => {
                    return {
                        name: item.data.name + ' ' + item.data.surname,
                        username: item.data.username,
                        avatar: item.data.photo,
                    };
                })
            );

            setContacts([...contactsUsers]);
        }
        addContact();
        // Заменить снизу
    }, [modalVisibe])

    const shutter = (username: string) => {
        console.log(username)
    }


    return (
        <div className={cl.root}>
            <ContactsModal visible={modalVisibe} setVisible={setModalVisible} />

            <div className={cl.title}>Contacts</div>
            <div className={cl.content}>
                <div className={cl.contacts}>
                    { !contacts.length ? 'У вас нет контактов!' : 
                        contacts.map((item, index) => (
                            <UserContact callback={shutter} key = {index} name = {item.name} avatar = {item.avatar} username = {item.username}/>
                        ))
                    }
                </div>
                <div className = {cl.button_add}>
                    <Button callback={runModal}>Add Contact</Button>
                </div>
            </div>
        </div>
    )
}

export default Contacts;