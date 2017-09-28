/**
 * Created by Xinhe on 2017-09-20.
 */
const market = require('./market')
const calendar = require('./calendar')
const graph = require('./graph')

const apis = [
    ...market,
    ...calendar,
    ...graph
]

module.exports = apis