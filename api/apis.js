/**
 * Created by Xinhe on 2017-09-20.
 */
const market = require('./market')
const calendar = require('./calendar')

const apis = [
    ...market,
    ...calendar
]

module.exports = apis