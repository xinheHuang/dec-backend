/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('./db')

const Recommend = database.define('recommend', {
    ID: { type: 'INTEGER', primaryKey: true },
    YID: { type: 'INTEGER', allowNull: false },
    code: { type: 'TEXT', allowNull: false },
})
module.exports = Recommend