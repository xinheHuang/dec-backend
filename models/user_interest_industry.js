/**
 * Created by Xinhe on 2017-09-20.
 */
const database = require('./db/index')

const UserInterestIndustry = database.define('user_interest_industry', {
    CID: {
        type: 'INTEGER',
        primaryKey: true,
    },
    UID: {
        type: 'INTEGER',
        primaryKey: true,
    },
})
module.exports = UserInterestIndustry