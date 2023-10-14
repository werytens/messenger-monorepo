import React, {useContext} from 'react';
import cl from './Navbar.module.css';
import { Context } from "../../..";
import { observer } from "mobx-react-lite";
import NavbarButton from '../NavbarButton/NavbarButton';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutButton from '../LogoutButton/LogoutButton';
import Avatar from '../Avatar/Avatar';

type NavbarProps = {
    select: boolean[];
    setSelect: React.Dispatch<React.SetStateAction<boolean[]>>;
}

const Navbar: React.FC<NavbarProps> = ({select, setSelect}) => {
    const {store} = useContext(Context);

    const logout = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        store.logout();
    }

    const selectNavbarItem = (target: string) => {
        const itemIndex = ['Home', 'Chat', 'Contacts', 'Notifications', 'Calendar', 'Settings'].indexOf(target);

        if (itemIndex !== -1) {
          const newSelect = Array.from({ length: 6 }, (_, i) => i === itemIndex);
          setSelect(newSelect);
        }
    }

    const buttonsData: { text: string; icon: React.ReactNode }[] = [
        { text: 'Home', icon: <HomeIcon /> },
        { text: 'Chat', icon: <EmailIcon /> },
        { text: 'Contacts', icon: <PersonIcon /> },
        { text: 'Notifications', icon: <NotificationsIcon /> },
        { text: 'Calendar', icon: <CalendarMonthIcon /> },
        { text: 'Settings', icon: <SettingsIcon /> },
    ];


    return (
        <div className={cl.navbar_root}>
            <div className={cl.information}>
                <div className={cl.self}>
                    <div className={cl.avatar_block}>
                        <Avatar item = {store.user.photo} size = {120} />
                    </div>
                    <div className={cl.text_block}>
                        <div className={cl.user_name}>
                            {store.user.name} {store.user.surname}
                        </div>
                        {
                            store.user.isActivated === null ?
                            <div className={cl.activate_message}>Учётная запись не активирована</div> : null
                        }
                    </div>
                </div>
                <div className={cl.buttons}>
                    {buttonsData.map((button, index) => (
                        <div key={index} className={select[index] ? [cl.buttons_item, cl.buttons_item_active].join(" ") : cl.buttons_item}>
                            <NavbarButton callback={selectNavbarItem} text={button.text}>
                                {button.icon}
                            </NavbarButton>
                        </div>
                    ))}
                </div>
            </div>
            <div className={cl.log_out}>
                <LogoutButton 
                callback={logout}
                text = 'Log Out'
                ><LogoutIcon/></LogoutButton>
            </div>
        </div>
    )
}

export default observer(Navbar);