/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('./db/index')
const Sequelize = require('sequelize')

const GraphNodeRelation = database.define('graph_node_relation', {
	GNID:{type:'INTEGER', primaryKey: true,autoIncrement: true,},
    NID: { type: Sequelize.STRING(20) },
    GID: { type: 'INTEGER', allowNull: false },
    FNID: { type: Sequelize.STRING(20), allowNull: false },
    direction: { type: 'TEXT', allowNull: false },
})
module.exports = GraphNodeRelation