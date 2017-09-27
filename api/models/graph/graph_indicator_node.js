/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('./db')

const GraphIndicatorNode = database.define('graph_indicator_node', {
    ID: { type: 'INTEGER', primaryKey: true },
    IID: { type: 'INTEGER', allowNull: false },
    NID: { type: 'INTEGER', allowNull: false },
    warn_type: { type: 'INTEGER', allowNull: false },
    upper_limit: { type: 'FLOAT', allowNull: false },
    lower_limit: { type: 'FLOAT', allowNull: false },
})
module.exports = GraphIndicatorNode