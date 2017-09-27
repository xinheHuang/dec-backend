/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('./db')

const GraphNode = database.define('graph_node', {
    NID: { type: 'INTEGER', primaryKey: true },
    GID: { type: 'INTEGER', allowNull: false },
    title: { type: 'TEXT', allowNull: false },
    FNID: { type: 'INTEGER', allowNull: false },
    direction: { type: 'TEXT', allowNull: false },
})
module.exports = GraphNode