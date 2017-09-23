/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('../../conf/database')

const Relation = database.define('relation', {
    // ID: { type: 'INTEGER', primaryKey: true },
    code: { type: 'TEXT', primaryKey: true },
    name: { type: 'TEXT', allowNull: false },
    industry: { type: 'TEXT', allowNull: false },
})
module.exports = Relation