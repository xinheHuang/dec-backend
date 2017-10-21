/**
 * Created by Xinhe on 2017-09-20.
 */
const market = require('./market')
const calendar = require('./calendar')
const graph = require('./graph')
const news = require('./news')
const search =require ('./search')
const user = require('./user')

const apis = [
    ...user,
    ...market,
    ...calendar,
    ...graph,
    ...news,
    ...search
]

module.exports = apis