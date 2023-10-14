import React, {useState, useContext} from "react";
import RegButton from "../../components/UI/RegButton/RegButton";
import RegInput from "../../components/UI/RegInput/RegInput";
import cl from './Registration.module.css';
import AuthError from "../../components/UI/AuthError/AuthError";
import { Context } from "../..";
import { observer } from "mobx-react-lite";



const Registration: React.FC = () => {
    const [errorText, setErrorText] = useState<string>('');
    const [validationError, setValidationError] = useState<boolean>(false);
    const [registrationData, setRegistrationData] = useState(['', '', '']);
    const [passwords, setPasswords] = useState(['', '']);
    const [nameData, setNameData] = useState(['', '']);
    const {store} = useContext(Context);
    
    const registrationValidation = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        const allData = [...passwords, ...nameData, ...registrationData];
        let errorTextForCheck = '';

        if (allData.filter(item => item === "").length > 0) {
            errorTextForCheck = 'Вы не заполнили все поля!'
        }

        if (nameData.filter(item => item.length > 1).length !== 2) {
            errorTextForCheck = 'Слишком короткое имя или фамилия.'
        }

        if (!/^[а-яА-Яa-zA-Z]+$/.test(nameData[0]) || !/^[а-яА-Яa-zA-Z]+$/.test(nameData[1])) {
            errorTextForCheck = 'Имя может состоять только из букв.'
        }

        if (passwords[0] !== passwords[1]) {
            errorTextForCheck = 'Вы неправильно ввели пароли! Они не совпадают!'
        }

        if (errorTextForCheck !== '') {
            setErrorText(errorTextForCheck);
            setValidationError(true);
            setTimeout(() => {setValidationError(false)}, 2000);
            return;
        }

        store.registration(nameData[0], nameData[1], registrationData[0], registrationData[1], passwords[0], registrationData[2]);
        // window.location.reload();
    }

    const updateData = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number,
        dataType: string
    ) => {
        switch(dataType) {
            case "password":
                const newPasswords = [...passwords];
                newPasswords[index] = e.target.value;
                setPasswords(newPasswords);
                break;
            case "name": 
                const newNameData = [...nameData];
                newNameData[index] = e.target.value;
                setNameData(newNameData);
                break;
            case "registration":
                const newRegistrationData = [...registrationData];
                newRegistrationData[index] = e.target.value;
                setRegistrationData(newRegistrationData);
                break;
            default:
                break;
        }
    }


    return (
        <div className={cl.registration}>
            <AuthError text = {errorText} visible={validationError}/>
            <form action="">
                <div className={cl.content}>
                    <div className={cl.title}>
                        Регистрация
                    </div>
                    <div className={cl.inputs_block}>
                        <div className={cl.fcs_inputs}>
                            <RegInput text = {'Введите имя'} type = {"text"} callback = {(e) => updateData(e, 0, 'name')} />
                            <RegInput text = {'Введите фамилию'} type = {"text"} callback = {(e) => updateData(e, 1, 'name')} />
                        </div>
                        <RegInput text = {'Введите логин'} type = {"text"} callback = {(e) => updateData(e, 0, 'registration')} />
                        <RegInput text={'Введите пароль'} type={"password"} callback = {(e) => updateData(e, 0, 'password')} />
                        <RegInput text={'Подтвердите пароль'} type={"password"} callback = {(e) => updateData(e, 1, 'password')}/>
                        <RegInput text = {'Введите почту'} type = {"text"} callback = {(e) => updateData(e, 1, 'registration')} />
                        <RegInput text = {'Введите номер телефона'} type = {"text"} callback = {(e) => updateData(e, 2, 'registration')} />    
                    </div>
                    <div className={cl.accept_block}>
                        <RegButton text={"Регистрация"} callback={registrationValidation} />
                    </div>
                </div>
            </form>
        </div>
    )
}


export default observer(Registration);