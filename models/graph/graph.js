/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('./db/index')

const Graph = database.define('graph', {
    GID: { type: 'INTEGER', primaryKey: true,autoIncrement: true, },
    entity: { type: 'TEXT', allowNull: false },
    author: { type: 'TEXT', allowNull: false },
    riqi: { type: 'DATETIME', allowNull: false },
    company: { type: 'TEXT', allowNull: false },
    type: { type: 'INTEGER', allowNull: false },
})
module.exports = Graph