const jwt = require('jsonwebtoken')
const models = require('../db/models')
require('dotenv').config()

class TokenService {
    generateTokens(payload) {
        const refreshToken = jwt.sign(payload, process.env.SECRET_JWT_REFRESH_KEY, {expiresIn: '30d'});
        return {refreshToken}
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.SECRET_JWT_ACCESS_KEY);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.SECRET_JWT_REFRESH_KEY);
            return userData;
        } catch (e) {
            return null;
        }
    }
    

    async saveToken(userId, refreshToken) {
        const tokenData = await models.tokens.findOne({where: {user_id: userId}})
        if (tokenData) {
            const res = await models.tokens.update({refreshToken}, {where: {user_id: userId}})

            return res;
        } else {
            const res = await models.tokens.create({
                user_id: userId,
                refreshToken
            })
            
            return res
        }
    }

    async removeToken(refreshToken) {
        const tokenData = models.tokens.destroy({where: {refreshToken}})
        return tokenData;
    }

    async findToken(refreshToken) {
        const tokenData = models.tokens.findOne({where: {refreshToken}})
        return tokenData;
    }
}

module.exports = new TokenService();