/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('./db/index')

const Graph = database.define('graph', {
    GID: { type: 'INTEGER', primaryKey: true,autoIncrement: true, },
    entity: { type: 'TEXT', allowNull: false },
    UID: { type: 'INTEGER', allowNull: false },
    riqi: { type: 'DATETIME', allowNull: false },
    type: { type: 'INTEGER', allowNull: false },
    name: { type: 'TEXT', allowNull: false },
})
module.exports = Graph
module.exports.GraphTypes={
    DRAFT:2,
    FINAL:1,
}