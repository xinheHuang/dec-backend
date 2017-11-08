/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('./db/index')

const Category = database.define('category', {
    CID: { type: 'INTEGER', primaryKey: true },
    name: { type: 'TEXT', allowNull: false },
    FCID: { type: 'INTEGER', allowNull: false },
})
module.exports = Category