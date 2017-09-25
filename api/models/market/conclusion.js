/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('./db')

const Conclusion = database.define('conclusion', {
    ID: { type: 'INTEGER', primaryKey: true },
    riqi: { type: 'DATE', allowNull: false },
    content1: { type: 'TEXT', allowNull: false },
    content2: { type: 'TEXT', allowNull: false },
})
module.exports = Conclusion