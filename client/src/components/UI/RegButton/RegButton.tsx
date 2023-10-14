import React from "react";
import cl from './RegButton.module.css'

interface PropsTypes {
    text: String;
    callback: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const RegButton: React.FC<PropsTypes> = ({text, callback}) => {
    return (
        <button className={cl.button} onClick={callback}>{text}</button>
    )
}



export default RegButton;