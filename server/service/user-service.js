const models = require('../db/models')
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiErrors = require('../exceptions/ApiErrors')


class UserService {
    //  , name, surname, username, phone
    async registration(name, surname, username, email, password, phone) {
        const candidateMail = await models.users.findOne({ where: {email} })
        const candidateUsername = await models.users.findOne({ where: { username } })
        
        if (candidateMail || candidateUsername) {
            throw ApiErrors.BadRequest('Пользователь с этими данными уже существует.')
        }

        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();

        const user = await models.users.create({
            // email, password, name, surname, username, phone, activationLink
            email, 
            password: hashPassword, 
            name, 
            surname,
            username,
            number: phone,
            activationLink
        })
        await mailService.sendActivationMail(email, `${process.env.API_LINK}/api/users/activate/${activationLink}`);

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...UserDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto}
    }

    async activate(activationLink) {
        const user = await models.users.findOne({where: {activationLink}});

        if (!user) {
            throw ApiErrors.BadRequest('Uncorrect activation link')
        }

        user.isActivated = true;
        await user.save();
    }

    async login(login, password) {
        console.log(login)

        let user;

        login.includes("@") 
        ? user = await models.users.findOne({where: {email: login}}) 
        : user = await models.users.findOne({where: {username: login}});

        if (!user) {
            throw ApiErrors.BadRequest('Пользователь с таким email / username не был найден.')
        }
        
        const isPasswordsEquals = await bcrypt.compare(password, user.password);
        if (!isPasswordsEquals) {
            throw ApiErrors.BadRequest('Неверный пароль.')
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        const data = await models.users.findOne({where: {id: userDto.id}});
        const userForReturn = {
            id: data.id,
            name: data.name,
            surname: data.surname,
            username: data.username,
            email: userDto.email,
            phone: data.number,
            isActivated: data.isActivated
        }

        return {...tokens, user: userForReturn}
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        console.log('refreshToken:',refreshToken)
        if (!refreshToken) {
            throw ApiErrors.UnauthorizedError();
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);

        // console.log(userData.id, tokenFromDb.id, tokenFromDb.user_id)

        if (!userData || !tokenFromDb) {
            throw ApiErrors.UnauthorizedError();
        }

        console.log('token: ', tokenFromDb.id)

        const user = await models.users.findOne({where: {id: tokenFromDb.user_id}})

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        const data = await models.users.findOne({where: {id: userDto.id}});
        const userForReturn = {
            id: data.id,
            name: data.name,
            surname: data.surname,
            username: data.username,
            email: userDto.email,
            phone: data.number,
            isActivated: data.isActivated,
            photo: data.photo
        }

        return {...tokens, user: userForReturn}
    }

    async getAllUsers() {
        const users = models.users.findAll();
        return users;
    }

    async addContact(userId, targetUsername) {
        const targetUser = await models.users.findOne({
            where: {
                username: targetUsername
            }
        })
        
        if (!targetUser) {
            throw ApiErrors.BadRequest('user not found')
        }

        if (userId == targetUser.id) {
            throw ApiErrors.BadRequest('u cant add urself in ur contacts list')
        }

        const contactCheck = await models.contacts.findOne({where: {
            user_id: userId,
            contact_id: targetUser.id
        }}) 

        if (contactCheck) {
            throw ApiErrors.BadRequest('u already have this user in ur contacts list')
        }

        const result = await models.contacts.create({
            user_id: userId,
            contact_id: targetUser.id
        })

        return result
    }

    async getUserContacts(id) {
        return (await models.contacts.findAll({where: { user_id: id } }))
    }

    async removeContact(id, targetId) {
        const userContacts = await models.contacts.findOne({where: {user_id: id, contact_id: targetId}});
        
        if (!userContacts) {
            throw ApiErrors.BadRequest('У Вас нет такого контакта');
        }

        userContacts.destroy();

        return 'успешно удалено'
    }

    async getUserById(id) {
        return (await models.users.findOne({where: {id: id}}))
    }

    async setOnlineStatus(user_id, online) {
        const result = await models.users.update({
            online
        }, {where: {id: user_id}})

        return result
    }

    async getUserByUsername(username) {
        return (await models.users.findOne({where: {username}}))
    }

    async changeAvatar(id, avatarLink) {
        return (await models.users.update({
            photo: avatarLink
        }, {where: {id}}))
    }

    async changeNameAndSurname(id, name, surname) {
        return (await models.users.update({
            name, surname
        }, {where: {id}}))
    }

    async changeEmail(id, email) {
        return (await models.users.update({
            email
        }, {where: {id}}))
    }
    
}

module.exports = new UserService();