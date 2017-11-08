/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('../db/index')
const Sequelize = require('sequelize')
const GRAPH = database.define('GRAPH', {
    graph_id: { type: 'INTEGER', primaryKey: true,autoIncrement: true, },
    entity: { type: 'TEXT', allowNull: false },
    user_id: { type: 'INTEGER', allowNull: false },
    time: { type: Sequelize.BIGINT(20), allowNull: false },
    type: { type: 'INTEGER', allowNull: false },
    name: { type: 'TEXT', allowNull: false },
})
module.exports = GRAPH
module.exports.GraphTypes={
    DRAFT:2,
    FINAL:1,
}