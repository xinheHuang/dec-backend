/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('./db/index')

const news = database.define('news', {
    NID: { type: 'INTEGER', primaryKey: true, autoIncrement: true },
    riqi: { type: 'DATE', allowNull: false },
    title: { type: 'TEXT', allowNull: false },
    abstract: { type: 'TEXT', allowNull: false },
    content: { type: 'LONGTEXT', allowNull: false },

    num_read: { type: 'INTEGER', allowNull: false },
    num_like: { type: 'INTEGER', allowNull: false },
    num_comment: { type: 'INTEGER', allowNull: false },

    source: { type: 'TEXT', allowNull: false },
    link: { type: 'TEXT', allowNull: false },
    author: { type: 'TEXT', allowNull: false },
    tags: { type: 'TEXT', allowNull: false },
})
module.exports = news