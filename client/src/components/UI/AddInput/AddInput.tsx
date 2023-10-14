import React from 'react';
import cl from './AddInput.module.css';

interface PropsTypes {
    children: string;
    callback: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AddInput: React.FC<PropsTypes> = ({children, callback}) => {
    return (
        <div className={cl.root}>
            <input className = {cl.input} placeholder={children} onChange={callback} />
        </div>
    )
}

export default AddInput;