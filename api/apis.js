/**
 * Created by Xinhe on 2017-09-20.
 */
const user = require('./controller/user')
const industry = require('./controller/industry')
const calendar = require('./controller/calendar')


const apis = [
    ...user,
    ...industry,
    ...calendar
]

module.exports = apis