/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('./db/index')

const searchList = database.define('search_list', {
    ID: { type: 'INTEGER', primaryKey: true, autoIncrement: true },
    riqi: { type: 'DATETIME', allowNull: false },
    keywords: { type: 'TEXT', allowNull: false },
   ID_news:{type:'INTEGER',allowNull:false},
    ID_report_image:{type:'INTEGER',allowNull:false},
    ID_indicator:{type:'INTEGER',allowNull:false},
    ID_graph:{type:'INTEGER',allowNull:false},
})
module.exports = searchList