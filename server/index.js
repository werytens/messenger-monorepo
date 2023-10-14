require('dotenv').config();
const cors = require('cors');
const express = require('express');
const http = require('http'); 
const WebSocket = require('ws'); 

const app = express();
const server = http.createServer(app); 

const PORT = process.env.PORT || 3000;
const sequelize = require('./db/db');
const models = require('./db/models');
const router = require('./routes/index');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middlewares/error-middleware');

app.use(cors({
    credentials: true,
    origin: [process.env.CLIENT_URL, 'http://msg.werytens.ru', 'http://msg.werytens.ru/']
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api', router);
// middleware error - last !
app.use(errorMiddleware);

const wss = new WebSocket.Server({ server }); // Создаем WebSocket-сервер, связанный с HTTP-сервером

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        broadcastMessage(JSON.parse(message))
    })
});

function broadcastMessage(message) {
    wss.clients.forEach(client => {
        client.send(JSON.stringify(message))
    })
}

const start = async () => {
    await sequelize.authenticate()
    await sequelize.sync()

    // await models.attachments.drop({ cascade: true });
    // await models.attachments_types.drop({ cascade: true });
    // await models.messeges.drop({ cascade: true });
    // await models.chats.drop({ cascade: true });
    // await models.contacts.drop({ cascade: true });
    // await models.users.drop({ cascade: true });
    // await models.tokens.drop({ cascade: true });

    console.log((await models.tokens.findAll()).length)

    const attachmentTypes = await models.attachments_types.findAll();
    if (attachmentTypes.length === 0) {
        await models.attachments_types.create({ id: 0, name: 'audio' })
        await models.attachments_types.create({ id: 1, name: 'image' })
        await models.attachments_types.create({ id: 2, name: 'other' })
    }


    server.listen(PORT, '0.0.0.0', () => {
        console.log(`Example app listening on url http://79.137.197.245:${PORT}/`);
    });
};

start();
