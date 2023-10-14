import React from "react";
import cl from './ImageAttachment.module.css'
import { API_URL } from "../../../services/APIURL";

interface Props {
    attachment_id: number | null;
    name: string;
}

const ImageAttachment: React.FC<Props> = ({attachment_id, name}) => {
    return (
        <img className={cl.attachment_img} src={API_URL + 'files/download/' + attachment_id} alt={name} />
    )
}

export default ImageAttachment;