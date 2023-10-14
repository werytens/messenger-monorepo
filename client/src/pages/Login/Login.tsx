import React, {useState, useContext} from "react";
import RegButton from "../../components/UI/RegButton/RegButton";
import RegInput from "../../components/UI/RegInput/RegInput";
import cl from './Login.module.css';
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import AuthError from "../../components/UI/AuthError/AuthError";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorText, setErrorText] = useState<string>('');
    const [validationError, setValidationError] = useState<boolean>(false);
    const {store} = useContext(Context);

    const setData = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.placeholder.startsWith('Имя')) {
            setEmail(event.target.value.toLocaleLowerCase())
        } else {
            setPassword(event.target.value.toLocaleLowerCase())
        }
    }

    const login = () => {
        if (email.length <= 2 || password.length <= 2) {
            setErrorText('Вы ввели слишком коротк(ие/ое) значени(я/е)!')
            setValidationError(true);
            setTimeout(() => {setValidationError(false)}, 1500)
            return;
        } else {
            store.login(email, password); 
        }
    }

    return (
        <div className={cl.login}>
            <AuthError text={errorText} visible={validationError} />

            <div className={cl.content}>
                <div className={cl.title}>
                    Авторизация
                </div>
                <RegInput text={'Имя пользователя / почта'} type={'text'} callback={setData} />
                <RegInput text={'Пароль'} type={'password'} callback={setData} />
                <div className={cl.registration_description}>
                    Не зарегистрированы?
                    <Link className={cl.reg_link} to = '/registration'>Регистрация</Link>
                </div>
                <div className={cl.accept_block}>
                    <RegButton text = {'Войти'} callback={login} />
                    {/* <button onClick={() => store.registration(email, password)}>reg</button> */}
                    {/* <button onClick={() => store.logout()}>logout</button> */}
                </div>
            </div>
        </div>
    )
}


export default observer(Login);