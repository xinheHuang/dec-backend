/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('./db/index')

const newsCategory = database.define('news_category', {
    CID: { type: 'INTEGER', primaryKey: true },
    name: { type: 'TEXT', allowNull: false },
    FCID: { type: 'INTEGER', allowNull: false },
    tier: { type: 'INTEGER', allowNull: false }
})
module.exports = newsCategory