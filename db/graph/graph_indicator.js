/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('./db/index')
const Sequelize = require('sequelize')

const GraphIndicator = database.define('graph_indicator', {
    ID: { type: 'INTEGER', primaryKey: true,autoIncrement: true, },
    IID: { type: 'INTEGER', allowNull: false },
    GNID: { type: 'INTEGER', allowNull: false },
    warn_type: { type: 'INTEGER', allowNull: false,default:0 },
    upper_limit: { type: 'FLOAT', allowNull: false,default:0 },
    lower_limit: { type: 'FLOAT', allowNull: false,default:0},
})
module.exports = GraphIndicator