/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('./db/index')

const BaseStock = database.define('base_stock', {
    ID: { type: 'INTEGER', primaryKey: true,autoIncrement: true, },
    code: { type: 'TEXT', allowNull: false },
    name: { type: 'TEXT', allowNull: false },
    industry_id: { type: 'INTEGER', allowNull: false },
})
module.exports = BaseStock