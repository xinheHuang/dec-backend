/**
 * Created by Xinhe on 2017-09-20.
 */
const market = require('./market')
const calendar = require('./calendar')
const graph = require('./graph')
const user = require('./user')

const apis = [
    ...market,
    ...calendar,
    ...graph,
    ...user
]

module.exports = apis