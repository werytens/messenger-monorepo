import React, {useContext} from 'react';
import { Context } from '../../..';

interface Props {
    item: string;
    size: number;
}

const Avatar: React.FC<Props> = ({item, size}) => {
    return (
        <img 
        src={item ? item : 'https://i.pinimg.com/originals/da/5b/fb/da5bfb82b9435747b6af8461acd0139c.png'} 
        alt="avatar" 
        style={{height: size, width: size, borderRadius: 1000}} 
        />
    )
}


export default Avatar;