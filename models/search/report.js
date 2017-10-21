/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('./db/index')

const report = database.define('report', {
    RID: { type: 'INTEGER', primaryKey: true,autoIncrement:true},
    fileID: { type: 'TEXT', allowNull: false },
    riqi: { type: 'DATETIME', allowNull: false },
    title: { type: 'TEXT', allowNull: false },
    broker: { type: 'TEXT', allowNull: false },
    analyst: { type: 'TEXT', allowNull: false },
    category: { type: 'TEXT', allowNull: false },
    industry: { type: 'TEXT', allowNull: false },
    equity: { type: 'TEXT', allowNull: false },
    is_imaged:{type:'INTEGER',allowNull:false},
    UID:{type:'INTEGER',allowNull:false},
    fileType: { type: 'TEXT', allowNull: false },
    page:{type:'INTEGER',allowNull:false},
})
module.exports = report