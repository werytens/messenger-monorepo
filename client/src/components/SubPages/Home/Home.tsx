import React from 'react';
import cl from './Home.module.css';

const Home: React.FC = () => {

    localStorage.setItem('lastpage', '1')

    return (
        <div className={cl.root}>
            <div className={cl.content}>
                <div className={cl.main_description}>
                    <div className={cl.title}>
                        Messenger
                    </div>
                    <div className={cl.description}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus eum dolorum enim vero excepturi laboriosam dolorem magni doloremque. Esse aliquid in mollitia sapiente doloremque placeat veniam accusamus nesciunt magnam odio.
                        Ipsum atque ratione nulla ea ab soluta fugiat quis molestias recusandae iure, minus quas ipsam, numquam deserunt architecto animi dolor perferendis qui! Animi adipisci architecto quibusdam non odit aspernatur magni!
                        Excepturi, asperiores maiores! Nesciunt saepe, autem deserunt quae commodi ipsum deleniti a qui nemo reprehenderit aut voluptas distinctio rerum tempora tempore labore illo. Odio ea facere non nostrum distinctio quibusdam?
                    </div>
                </div>
                <div className={cl.dependencies}>
                    <div className={cl.title}>
                        Stack
                    </div>
                    <div className={cl.frontend}>
                        <div className={cl.subtitle}>Frontend</div>
                        <div className={cl.description}>

                        React: Основной фреймворк для разработки пользовательского интерфейса.
                        <br /><br />
                        Material-UI: Библиотека компонентов для создания стильных интерфейсов.
                        <br /><br />
                        Mobx: Для управления состоянием приложения и реактивных обновлений.
                        <br /><br />
                        Axios: Для выполнения HTTP запросов к серверу.
                        <br /><br />
                        WebSocket (ws): Используется для реализации мгновенных сообщений и обновлений в реальном времени.
                        <br /><br />
                        TypeScript: Язык программирования, который обеспечивает статическую типизацию и улучшает безопасность кода.

                        </div>
                    </div>
                    <div className={cl.backend}>
                        <div className={cl.subtitle}>Backend</div>
                        <div className={cl.description}>

                        Express: Веб-фреймворк для создания и обработки запросов на стороне сервера.
                        <br /><br />
                        JWT (JSON Web Tokens): Для аутентификации и авторизации пользователей.
                        <br /><br />
                        PostgreSQL и Sequelize: Реляционная база данных и ORM для хранения и управления данными.
                        <br /><br />
                        bcrypt: Для безопасного хеширования паролей пользователей.
                        <br /><br />
                        Nodemailer: Позволяет отправлять электронные письма для функциональности уведомлений и восстановления паролей.
                        <br /><br />
                        WebSocket (ws): Используется на стороне сервера для взаимодействия с клиентами в реальном времени.

                        </div>
                    </div>
                </div>

                <div className={cl.source_code}>
                    <a href="https://github.com/werytens/messenger" target='_blank'>*Исходный код*</a>
                </div>
            </div>
        </div>
    )
}

export default Home;