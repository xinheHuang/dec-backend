/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('./db/index')

const Calendar2 = database.define('calendar2', {
    ID: { type: 'INTEGER', primaryKey: true },
    title: { type: 'TEXT', allowNull: false },
    riqi_detail: { type: 'DATETIME', allowNull: false },
    content: { type: 'TEXT', allowNull: false },
    author: { type: 'TEXT', allowNull: false },
    type: { type: 'INTEGER', allowNull: false },
    dial: { type: 'TEXT', allowNull: false },
    password: { type: 'TEXT', allowNull: false },
    location: { type: 'TEXT', allowNull: false },
    guest: { type: 'TEXT', allowNull: false },
    contact: { type: 'TEXT', allowNull: false },
})
module.exports = Calendar2