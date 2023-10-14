import React from 'react';
import cl from './AuthError.module.css'

interface PropsTypes {
    text: String;
    visible: Boolean;
}

const AuthError: React.FC<PropsTypes> = ({text, visible}) => {
    return (
        <div className={ visible ? [cl.modal, cl.active].join(' ') : cl.modal }>
            {text}
        </div>
    )
}


export default AuthError;