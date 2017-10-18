/**
 * Created by Xinhe on 2017-09-20.
 */
const market = require('./market')
const calendar = require('./calendar')
const graph = require('./graph')
const news = require('./news')
const user = require('./user')

const apis = [
    ...user,
    ...market,
    ...calendar,
    ...graph,
    ...news,
]

module.exports = apis