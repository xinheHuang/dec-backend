/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('./db/index')

const UserInterest = database.define('user_interest', {
    ID: {
        type: 'INTEGER',
        primaryKey: true,
        autoIncrement: true,
    },
    UID: {
        type: 'INTEGER',
        allowNull: false,
    },
    type:{
        type: 'INTEGER',
        allowNull: false,
    },
    content:{
        type: 'TEXT',
        allowNull: false,
    }
})
module.exports = UserInterest