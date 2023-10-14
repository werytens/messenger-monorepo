import React, { useContext, useState } from 'react';
import cl from './Settings.module.css';
import { Context } from '../../..';
import Button from '../../UI/Button/Button';
import AddInput from '../../UI/AddInput/AddInput';
import UserService from '../../../services/UserService';

const Settings: React.FC = () => {

    localStorage.setItem('lastpage', '6')

    const {store} = useContext(Context);

    const [avatarModalVisible, setAvatarModalVisible] = useState<boolean>(false); 
    const [avatarLink, setAvatarLink] = useState<string>('');

    const [name, setName] = useState<string>(store.user.name);
    const [surname, setSurname] = useState<string>(store.user.surname);
    const [email, setEmail] = useState<string>(store.user.email);

    const [disabledNSSave, setDisabledNSSave] = useState<boolean>(true);
    const [disabledEmailSave, setDisabledEmailSave] = useState<boolean>(true);
    


    const shutter = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        console.log(1)
    }

    const openAvatarModal = () => {
        setAvatarModalVisible(true);
    }

    const changeAvatar = () => {
        const goChange = async () => {
            await UserService.ChangeAvatar(Number(store.user.id), avatarLink);

            await store.checkAuth();
        }
        goChange();
    }

    const changeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);

        if (name !== store.user.name) {
            setDisabledNSSave(false);
        }
    }

    const changeSurname = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSurname(e.target.value);

        if (surname !== store.user.surname) {
            setDisabledNSSave(false);
        }
    }

    const changeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);

        if (email !== store.user.email) {
            setDisabledEmailSave(false);
        }
    }
    
    const saveNameSurname = () => {
        const changeNS = async () => {
            await UserService.ChangeNameAndSurname(Number(store.user.id), name, surname);
            await store.checkAuth();
        }
        changeNS();
    }

    const saveEmail = () => {
        const changeEmail = async () => {
            await UserService.ChangeEmail(Number(store.user.id), email);
            await store.checkAuth();
        }
        changeEmail();
    }

    return (
        <div className={cl.root}>

            <div 
                className ={avatarModalVisible ? [cl.avatar_change_modal, cl.active].join(" ") : cl.avatar_change_modal}
                onClick={() => setAvatarModalVisible(false)}
            >
                <div className={cl.content} onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
                    <AddInput callback={(e) => setAvatarLink(e.target.value)}>Введите ссылку на картинку</AddInput>
                    <Button callback={changeAvatar}>Change</Button>
                </div>
            </div>

            <div className={cl.avatar_settings}>
                <div className={cl.avatar_block}>
                    {
                        store.user.photo ?
                        <img className={cl.avatar} src={store.user.photo}/> : avatarLink ? 
                        <img className={cl.avatar} src={avatarLink}/>
                        : <div>Аватар не установлен</div>
                    }
                </div>
                <div className={cl.avatar_change_button}>
                    <Button callback={openAvatarModal}>Change</Button>
                </div>
            </div>

                    
            <div className={cl.name_settings} >
                <input 
                    className={cl.name} 
                    value = {name} 
                    onChange={changeName}
                />
                <input 
                    className={cl.surname} 
                    value = {surname} 
                    onChange={changeSurname}
                />
                <button 
                    disabled = {disabledNSSave}
                    onClick={saveNameSurname}
                >
                    Save
                </button>
            </div>

            <div className={cl.confidentiality_settings}>
                <input 
                    className={cl.email} 
                    value = {email} 
                    onChange={changeEmail}
                />
                <button 
                    disabled = {disabledEmailSave}
                    onClick={saveEmail}
                >
                    Save
                </button>
            </div>
        </div>
    )
}

export default Settings;