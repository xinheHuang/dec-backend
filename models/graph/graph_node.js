/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('./db/index')
const Sequelize = require('sequelize')

const GraphNode = database.define('graph_node', {
    NID: { type: Sequelize.STRING(20), primaryKey: true },
    title: { type: 'TEXT', allowNull: false },
})
module.exports = GraphNode