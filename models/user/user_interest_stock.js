/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('./db/index')

const UserInterestStock = database.define('user_interest_stock', {
    SID: {
        type: 'INTEGER',
        primaryKey: true,
    },
    UID: {
        type: 'INTEGER',
        primaryKey: true,
    },
})
module.exports = UserInterestStock