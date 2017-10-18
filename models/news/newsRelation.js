/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('./db/index')

const newsRelation = database.define('news_relation', {
    ID: { type: 'INTEGER', primaryKey: true,autoIncrement:true },
    NID: { type: 'INTEGER', allowNull: false },
    CID: { type: 'INTEGER', allowNull: false },
})
module.exports = newsRelation