const models = require('../db/models');
const ApiErrors = require('../exceptions/ApiErrors')

class MessageService {
    async send(chat_id, content, author_id, checked, attachment_id) {
        const chat = await models.chats.findOne({where: {id: chat_id}});

        if (!chat) {
            throw ApiErrors.BadRequest('chat not found')
        }

        const message = await models.messeges.create({
            // Надо поменять, так сделано для теста
            // id: (await models.messeges.findAll()).length + 30,
            chat_id, content, author_id,
            checked, deleted: false,
            attachment_id
        })

        return message
    }

    async makeChecked(ids) {
        console.log(ids)
        for (let index = 0; index < ids.length; index++) {
            const update = await models.messeges.update({
                checked: true
            }, {where: {id: ids[index]}})
            console.log(update, ids[index])
        }

        return 'success'
    }

    async delete(id) {
        const result = await models.messeges.destroy({where: {id}})

        if (!result) {
            throw ApiErrors.BadRequest('messages not found')
        }

        return result
    }

    async edit(id, content) {
        const message = await models.messeges.findOne({where: {id}})

        if (!message) {
            throw ApiErrors.BadRequest('message not found')
        }

        const result = await models.messeges.update({
            content
        }, {where: {id: message.id}})

        return result
    }

    async get(chat_id) {
        const messeges = await models.messeges.findAll({where: {chat_id}, order: [['createdAt']]})

        if (!messeges) {
            throw ApiErrors.BadRequest('messages not found')
        }

        return messeges
    }

    async getLast(chat_id) {
        const message = await models.messeges.findOne({where: {chat_id}, order: [['createdAt', 'DESC']]})

        return message
    }

    async getUnchecked(chatId) {
        return await models.messeges.findAll({
            attributes: ['author_id'],
            where: { checked: false, chat_id: chatId },
        });
    }

    async addAttachment(id, type, name, path, size) {
        const typeId = type.split('/').includes('image') ? 0 : type.split('/').includes('audio') ? 1 : 2;

        const response = await models.attachments.create({
            id,
            attachment_type_id: typeId,
            attachment_name: name,
            attachment_size: size,
            attachment_path: path
        })

        return response
    }

    async getAttachment(id) {
        return await models.attachments.findOne({where: {id}});
    }

    async deleteAttachment(messageId, attachmentId) {
        console.log('bobik2: ', messageId, attachmentId)

        const response = await models.messeges.update(
            { attachment_id: null },
            {
              where: { attachment_id: attachmentId },
            }
          );

        return response
    }

    async nextId() {
        const response = (await models.messeges.findAll()).length;

        console.log('messages count:', response)

        return response
    }
}

module.exports = new MessageService();
