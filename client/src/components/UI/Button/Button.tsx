import React from 'react';
import cl from './Button.module.css'

interface PropsTypes {
    children: React.ReactNode;
    callback: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Button: React.FC<PropsTypes> = ({children, callback}) => {
    return (
        <button className={cl.button} onClick={callback}>{children}</button>
    )
}


export default Button;