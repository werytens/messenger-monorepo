import React, { useContext } from 'react';
import cl from './Attachment.module.css';
import { API_URL } from '../../../services/APIURL';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';


interface Props {
    size: number;
    name: string;
    attachment_id: number | null;
}

function convertFileSize(bytes: number): string {
    const units = ['байт', 'КБ', 'МБ', 'ГБ', 'ТБ', 'ПБ', 'ЭБ', 'ЗБ', 'ИБ'];

    let index = 0;
    while (bytes >= 1024 && index < units.length - 1) {
      bytes /= 1024;
      index++;
    }

    return `${Math.ceil(bytes)} ${units[index]}`;
}

// Стили не перенёс

const Attachment: React.FC<Props> = ({size, name, attachment_id}) => {

    return (
        <a
            className={cl.other_attachment}
            href={API_URL + 'files/download/' + attachment_id}
        >
            <div className={cl.attachment_icon}>
                <InsertDriveFileIcon/>
            </div>
            ({convertFileSize(size)}) {name}
        </a> 
            
    )
}

export default Attachment;