/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('./db/index')

const User = database.define('user', {
    UID: {
        type: 'INTEGER',
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: 'TEXT',
        allowNull: false,
        unique: true
    },
    password: {
        type: 'TEXT',
        allowNull: false
    },
    broker: {
        type: 'TEXT',
        allowNull: false
    },
    industry: {
        type: 'TEXT',
        allowNull: false
    },
    position: {
        type: 'TEXT',
        allowNull: false
    },
    mobile: {
        type: 'TEXT',
        allowNull: false
    },
    name: {
        type: 'TEXT',
        allowNull: false
    },
})
module.exports = User