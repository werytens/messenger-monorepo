const sequelize = require('./db')
const { DataTypes } = require("sequelize");



const users = sequelize.define("users", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: false },
    surname: { type: DataTypes.STRING, allowNull: true, unique: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    photo: { type: DataTypes.STRING, allowNull: true, unique: false },
    number: { type: DataTypes.STRING, allowNull: true, unique: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false, unique: false },
    isActivated: { type: DataTypes.BOOLEAN, allowNull: true },
    activationLink: { type: DataTypes.STRING },
    online: { type: DataTypes.BOOLEAN, allowNull: true }
})

const chats = sequelize.define("chats", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    owner_id: { type: DataTypes.INTEGER, allowNull: false},
    target_id: { type: DataTypes.INTEGER, allowNull: false},
})

const messeges = sequelize.define("messeges", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    chat_id: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.STRING, allowNull: false },
    author_id: { type: DataTypes.INTEGER, allowNull: false },
    checked: { type: DataTypes.BOOLEAN, allowNull: true },
    deleted: { type: DataTypes.BOOLEAN, allowNull: true },
    attachment_id: { type: DataTypes.INTEGER, allowNull: true }
})

const tokens = sequelize.define('tokens', {
    user_id: { type: DataTypes.INTEGER, allowNull: false},
    refreshToken: { type: DataTypes.STRING },
})

const contacts = sequelize.define('contacts', {
    user_id: { type: DataTypes.INTEGER, allowNull: false},
    contact_id: { type: DataTypes.INTEGER, allowNull: false},
})

const attachments = sequelize.define('attachemnts', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    attachment_type_id: { type: DataTypes.INTEGER, allowNull: false },
    attachment_name: { type: DataTypes.STRING, allowNull: false },
    attachment_size: { type: DataTypes.STRING, allowNull: false },
    attachment_path: { type: DataTypes.STRING, allowNull: false },
})

const attachments_types = sequelize.define('attachments_types', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false }
})

users.hasOne(chats);
chats.belongsTo(users, { foreignKey: 'owner_id' })

users.hasOne(chats);
chats.belongsTo(users, { foreignKey: 'target_id' })

users.hasOne(tokens);
tokens.belongsTo(users, { foreignKey: 'user_id' })

chats.hasOne(messeges);
messeges.belongsTo(chats, { foreignKey: 'chat_id' })

users.hasOne(messeges);
messeges.belongsTo(users, { foreignKey: 'author_id' })

users.hasOne(contacts);
contacts.belongsTo(users, { foreignKey: 'user_id' })

users.hasOne(contacts);
contacts.belongsTo(users, { foreignKey: 'contact_id' })

messeges.hasOne(attachments);
attachments.belongsTo(messeges, { foreignKey: 'attachment_id' })

attachments.hasOne(attachments_types);
attachments_types.belongsTo(attachments, { foreignKey: 'attachment_type_id' })


module.exports = {
    users,
    chats,
    messeges,
    tokens,
    contacts,
    attachments,
    attachments_types
}