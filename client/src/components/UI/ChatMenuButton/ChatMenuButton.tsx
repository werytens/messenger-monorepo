import React from "react";
import cl from './ChatMenuButton.module.css';

interface Props {
    children: React.ReactNode;
    callback: () => void;
    reference?: React.RefObject<HTMLDivElement>;
}

const ChatMenuButton: React.FC<Props> = ({children, callback, reference = undefined}) => {
    return (
        <div className={cl.button} onClick={callback} ref = {reference}>
            {children}
        </div>
    )
}

export default ChatMenuButton;