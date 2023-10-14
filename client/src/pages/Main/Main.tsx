import React, {useState} from "react";
import cl from './Main.module.css';
import Navbar from "../../components/UI/Navbar/Navbar";
import ChatList from "../../components/SubPages/ChatList/ChatList";
import Calendar from "../../components/SubPages/Calendar/Calendar";
import Contacts from "../../components/SubPages/Contacts/Contacts";
import Home from "../../components/SubPages/Home/Home";
import Notifications from "../../components/SubPages/Notifications/Notifications";
import Settings from "../../components/SubPages/Settings/Settings";


const Main: React.FC = () => {
    const [select, setSelect] = useState([false, false, false, false, false, false])
    
    if (!select.includes(true)) {
        if (localStorage.getItem('lastpage') === null) {
            setSelect([false, true, false, false, false, false])
        } else {
            const arrayOfPages = [false, false, false, false, false, false];
            arrayOfPages[Number(localStorage.getItem('lastpage')) - 1] = true;
            setSelect(arrayOfPages);
        }
    }

    const shutter = () => {
        console.log(select)
    }

    return (
        <div className={cl.main_root}>
            <Navbar select = {select} setSelect = {setSelect}/>
            {
                select[0] ? <Home/> : 
                select[1] ? <ChatList/> : 
                select[2] ? <Contacts/> : 
                select[3] ? <Notifications/> : 
                select[4] ? <Calendar/> : 
                select[5] ? <Settings/> : <ChatList/>  
            }
        </div>
    )
}

export default Main;