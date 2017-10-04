/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('./db')
const Sequelize = require('sequelize')

const GraphIndicatorNode = database.define('graph_indicator_node', {
    ID: { type: 'INTEGER', primaryKey: true,autoIncrement: true, },
    IID: { type: 'INTEGER', allowNull: false },
    NID: { type: Sequelize.STRING(20), allowNull: false },
    warn_type: { type: 'INTEGER', allowNull: false },
    upper_limit: { type: 'FLOAT', allowNull: false },
    lower_limit: { type: 'FLOAT', allowNull: false },
})
module.exports = GraphIndicatorNode