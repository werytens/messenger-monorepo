import React, { useState, HTMLInputTypeAttribute } from "react";
import cl from './RegInput.module.css'
import VisibilityIcon from '@mui/icons-material/Visibility';

interface PropsTypes {
    type: HTMLInputTypeAttribute;
    text: string;
    callback: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RegInput: React.FC<PropsTypes> = ({ type, text, callback }) => {
    const [inputType, setInputType] = useState<string>(type);

    const changeType = () => {
        inputType === 'password' ? setInputType('text') : setInputType('password');
    }

    return (
        <div className={cl.content}>
            <input className={cl.input} type={inputType} placeholder={text} onChange={callback} />
            {
                type === 'password' ?
                    <div className={cl.button} onClick={changeType}>
                        {<VisibilityIcon/>}
                    </div> : null
            }
        </div>
    )
}


export default RegInput;