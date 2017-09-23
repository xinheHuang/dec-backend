/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('../../conf/database')

const Recommend = database.define('recommend', {
    ID: { type: 'INTEGER', primaryKey: true },
    YID: { type: 'INTEGER', allowNull: false },
    recommend: { type: 'TEXT', allowNull: false },
})
module.exports = Recommend