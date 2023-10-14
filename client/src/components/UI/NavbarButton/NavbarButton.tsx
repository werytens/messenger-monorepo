import React from 'react';
import cl from './NavbarButton.module.css';

interface PropsTypes {
    children: React.ReactNode;
    text: string;
    callback: (target: string) => void;
}

const NavbarButton: React.FC<PropsTypes> = ({callback, text, children = undefined}) => {
    return (
        <button className={cl.button} onClick={() => callback(text)}>
            {children !== undefined ? <div className={cl.emoji}>{children}</div> : null }
            <div className={cl.text}>
                {text}
            </div>
        </button>
    )
}

export default NavbarButton;