/**
 * Created by Xinhe on 2017-09-20.
 */
const user = require('./controller/user')
const industry = require('./controller/industry')
const apis = [
    ...user,
    ...industry,
]

module.exports = apis