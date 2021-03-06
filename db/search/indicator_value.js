/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('./db/index')

const IndicatorValue = database.define('indicator_value', {
    ID: { type: 'INTEGER', primaryKey: true },
    ID_tong: { type: 'TEXT', allowNull: false },
    riqi: { type: 'DATE', allowNull: false },
    value: { type: 'FLOAT', allowNull: false },
})
module.exports = IndicatorValue