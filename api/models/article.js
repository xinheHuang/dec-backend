/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('../../conf/database')

const Article = database.define('article', {
    YID: { type: 'INTEGER', primaryKey: true },
    title: { type: 'TEXT', allowNull: false },
    author: { type: 'TEXT', allowNull: false },
    content: { type: 'LONGTEXT', allowNull: false },
    num_read: { type: 'INTEGER', allowNull: false },
    num_like: { type: 'INTEGER', allowNull: false },
    riqi: { type: 'DATE', allowNull: false },
    industry: { type: 'TEXT', allowNull: false },
    company: { type: 'TEXT', allowNull: false },
    topic: { type: 'TEXT', allowNull: false },
})
module.exports = Article