const userService = require('../service/user-service');
const {validationResult} = require('express-validator');
const ApiErrors = require('../exceptions/ApiErrors');
const models = require('../db/models')

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiErrors.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {name, surname, username, email, password, phone} = req.body;
            const userData = await userService.registration(name, surname, username, email, password, phone);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
            return res.json(userData);
        }   catch (e) {
            next(e);
        }     
    }
    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
            return res.json(userData);
        }   catch (e) {
            next(e);
        }     
    }
    async addContact(req, res, next) {
        try {
            const {userId, targetUsername} = req.body;
            const result = await userService.addContact(userId, targetUsername);
            return res.json(result)
        } catch (e) {
            next(e);
        }
    }
    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json();
        }   catch (e) {
            next(e);
        }     
    }
    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        }   catch (e) {
            console.log(e);
        }     
    }
    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
            return res.json(userData);
        }   catch (e) {
            next(e);
        }     
    }
    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users);
        }   catch (e) {
            next(e);
        }         
    }
    async getUserById(req, res, next) {
        try {
            const id = req.params.id;
            const data = await userService.getUserById(id);
            return res.json(data);
        } catch (e) {
            next(e);
        }
    }

    async getUserContacts (req, res, next) {
        try {
            const id = req.params.id;
            const result = await userService.getUserContacts(id);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async setOnlineStatus(req, res, next) {
        try {
            const {user_id, online} = req.body;
            const result = await userService.setOnlineStatus(user_id, online);
            return res.json(result); 
        } catch (e) {
            next(e);
        }
    }

    async getByUsername(req, res, next) {
        try {
            const username = req.params.username;
            const result = await userService.getUserByUsername(username);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async changeAvatar(req, res, next) { 
        try {
            const {id, avatarLink} = req.body;
            const result = await userService.changeAvatar(id, avatarLink);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async changeNameAndSurname(req, res, next) {
        try {
            const {id, name, surname} = req.body;
            const result = await userService.changeNameAndSurname(id, name, surname);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async changeEmail(req, res, next) {
        try {
            const {id, email} = req.body;
            const result = await userService.changeEmail(id, email);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserController();