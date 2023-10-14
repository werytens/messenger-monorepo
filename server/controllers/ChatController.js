const ChatService = require('../service/chat-service')
const ApiErrors = require('../exceptions/ApiErrors');
const models = require('../db/models')

class ChatController {
    async create(req, res, next) {
        try {
            const {id, targetId} = req.body;
            const result = await ChatService.create(id, targetId);
            return res.json({...result});
        } catch (e) {
            next(e);
        }
    }

    async get(req, res, next) {
        try {
            const id = req.params.id;
            const result = await ChatService.getChats(id);
            return res.json({"chats": result})
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new ChatController();