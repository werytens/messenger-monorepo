import React from 'react';
import cl from './SearchInput.module.css';
import SearchIcon from '@mui/icons-material/Search';

interface PropsTypes {
    children: string;
    callback: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<PropsTypes> = ({children, callback}) => {
    return (
        <div className={cl.root}>
            <SearchIcon></SearchIcon>
            <input 
                className = {cl.input} 
                placeholder={children} 
                onChange={callback}    
            />
        </div>
    )
}

export default SearchInput;