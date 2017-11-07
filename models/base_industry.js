/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('./db/index')

const BaseIndustry = database.define('base_industry', {
    CID: { type: 'INTEGER', primaryKey: true,autoIncrement: true, },
    name: { type: 'TEXT', allowNull: false },
    tier: {type :' INTEGER', allowNull:false},
    FCID: { type: 'INTEGER', allowNull: false },
})
module.exports = BaseIndustry