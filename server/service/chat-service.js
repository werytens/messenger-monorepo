const models = require('../db/models');
const ApiErrors = require('../exceptions/ApiErrors')

class ChatService {
    async create(id, targetId) {
        const chat = await models.chats.findOne({where: {owner_id: id, target_id: targetId}});

        if (chat) {
            throw ApiErrors.BadRequest('this chat alrd created')
        }

        const result = await models.chats.create({
            id: (await models.chats.findAll()).length,
            owner_id: id,
            target_id: targetId
        })

        return result
    }

    async getChats(id) {
        const ownerChats = await models.chats.findAll({where: {owner_id: id}});
        const targetChats = await models.chats.findAll({where: {target_id: id}});

        const allChats = [...ownerChats, ...targetChats];

        if (!allChats) {
            throw ApiErrors.BadRequest('chat not found')
        }

        return allChats
    }
}

module.exports = new ChatService();