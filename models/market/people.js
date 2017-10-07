/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('./db/index')

const People = database.define('people', {
    AID: { type: 'INTEGER', primaryKey: true },
    name: { type: 'TEXT', allowNull: false },
    riqi: { type: 'DATE', allowNull: false },
    industry: { type: 'TEXT', allowNull: false },
    broker: { type: 'TEXT', allowNull: false },
    mobile: { type: 'TEXT', allowNull: false },
})
module.exports = People