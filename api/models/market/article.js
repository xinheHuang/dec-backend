/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('./db')

const Article = database.define('article', {
    YID: { type: 'INTEGER', primaryKey: true },
    title: { type: 'TEXT', allowNull: false },
    author: { type: 'TEXT', allowNull: false },
    content: { type: 'LONGTEXT', allowNull: false },
    num_read: { type: 'INTEGER', allowNull: false },
    num_like: { type: 'INTEGER', allowNull: false },
    riqi: { type: 'DATE', allowNull: false },
    industry: { type: 'TEXT', allowNull: true },
    broker: { type: 'TEXT', allowNull: true },
    topic: { type: 'TEXT', allowNull: true },
})
module.exports = Article