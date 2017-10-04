/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('./db')
const Sequelize = require('sequelize')

const GraphComment = database.define('graph_comment', {
    CID: { type: 'INTEGER', primaryKey: true,autoIncrement: true, },
    NID: { type: Sequelize.STRING(20), allowNull: false },
    riqi: { type: 'DATETIME', allowNull: false },
    author: { type: 'TEXT', allowNull: false },
    institution: { type: 'TEXT', allowNull: false },
    content: { type: 'LONGTEXT', allowNull: false },
})
module.exports = GraphComment