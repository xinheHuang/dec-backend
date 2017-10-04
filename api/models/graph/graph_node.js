/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('./db')
const Sequelize = require('sequelize')

const GraphNode = database.define('graph_node', {
    NID: { type: Sequelize.STRING(20), primaryKey: true },
    GID: { type: 'INTEGER', allowNull: false },
    title: { type: 'TEXT', allowNull: false },
    FNID: { type: Sequelize.STRING(20), allowNull: false },
    direction: { type: 'TEXT', allowNull: false },
})
module.exports = GraphNode