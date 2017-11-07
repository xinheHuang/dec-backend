/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('./db/index')

const IndicatorComment = database.define('indicator_comment', {
    ID: { type: 'INTEGER', primaryKey: true },
    ID_tong: { type: 'TEXT', allowNull: false },
    riqi: { type: 'DATETIME', allowNull: false },
    comment: { type: 'TEXT', allowNull: false },
})
module.exports = IndicatorComment