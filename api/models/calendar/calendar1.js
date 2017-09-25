/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('./db')

const Calendar1 = database.define('calendar1', {
    ID: { type: 'INTEGER', primaryKey: true },
    indicator: { type: 'TEXT', allowNull: false },
    riqi_detail: { type: 'DATETIME', allowNull: false },
    riqi: { type: 'DATE', allowNull: false },
    country: { type: 'TEXT', allowNull: false },
    previous: { type: 'FLOAT', allowNull: false },
    estimate: { type: 'FLOAT', allowNull: false },
    announce: { type: 'FLOAT', allowNull: false },
    institution: { type: 'TEXT', allowNull: false },
    unit: { type: 'TEXT', allowNull: false },
})
module.exports = Calendar1