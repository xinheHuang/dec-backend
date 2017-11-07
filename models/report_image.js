/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('./db/index')

const reportImage = database.define('report_image', {
    MID: { type: 'INTEGER', primaryKey: true},
    fileID: { type: 'TEXT', allowNull: false },
    sequence:{type:'INTEGER',allowNull:false},
    title: { type: 'TEXT', allowNull: false },
    source: { type: 'TEXT', allowNull: false },
    UID:{type:'INTEGER',allowNull:false},
    riqi: { type: 'DATETIME', allowNull: false },
    is_checked:{type:'INTEGER',allowNull:false},
    is_useless:{type:'INTEGER',allowNull:false},
    comment: { type: 'TEXT', allowNull: false },
})
module.exports = reportImage