const messageService = require('../service/message-service');
const {validationResult} = require('express-validator');
const ApiErrors = require('../exceptions/ApiErrors');
const models = require('../db/models')

class MessagesController {
    async send(req, res, next) {
        try {
            const {chat_id, content, author_id, checked, attachment_id} = req.body;
            const response = await messageService.send(chat_id, content, author_id, checked, attachment_id);
            return res.json(response);
        } catch (e) {
            next(e);
        }
    }

    async makeChecked(req, res, next) {
        try {
            const {ids} = req.body.data;
            const response = await messageService.makeChecked(ids);
            return res.json(response);
        } catch (e) {
            next(e);
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.body;
            const response = await messageService.delete(id);
            return res.json(response);
        } catch (e) {
            next(e);
        }
    }

    async edit(req, res, next) {
        try {
            const {id, content} = req.body.data;
            const response = await messageService.edit(id, content);
            return res.json(response);
        } catch (e) {
            next(e);
        }
    }

    async get(req, res, next) {
        try {
            const id = req.params.id;
            const response = await messageService.get(id);
            return res.json(response);
        } catch (e) {
            next(e);
        }
    }

    async getLast(req, res, next) {
        try {
            const id = req.params.id;
            const response = await messageService.getLast(id);
            return res.json(response);
        } catch (e) {
            next(e);
        }
    }

    async getUnchecked(req, res, next) {
        try {
            const chatId = req.params.chatId;
            const response = await messageService.getUnchecked(chatId);
            return res.json(response);
        } catch (e) {
            next(e);
        }
    }

    async addAttachment(req, res, next) {
        try {
            const {id, type, name, path, size} = req.body;
            const response = await messageService.addAttachment(id, type, name, path, size);
            return res.json(response);
        } catch (e) {
            next(e);
        }
    }

    async getAttachment(req, res, next) {
        try {
            const id = req.params.id;
            const response = await messageService.getAttachment(id);
            return res.json(response);
        } catch (e) {
            next(e);
        }
    }

    async deleteAttachment(req, res, next) {
        try {
            const { messageId, attachmentId } = req.body;
            const response = await messageService.deleteAttachment(messageId, attachmentId);
            return res.json(response);
        } catch (e) {
            next(e);
        }
    }

    async nextId(req, res, next) {
        try {
            const response = await messageService.nextId();
            return res.json(response);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new MessagesController();