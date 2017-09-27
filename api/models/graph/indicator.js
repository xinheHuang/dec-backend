/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('./db')

const Indicator = database.define('indicator', {
    IID: { type: 'INTEGER', primaryKey: true },
    title: { type: 'TEXT', allowNull: false },
    frequency: { type: 'TEXT', allowNull: false },
    unit: { type: 'TEXT', allowNull: false },
    source: { type: 'TEXT', allowNull: false },
})
module.exports = Indicator