const session = require('koa-session')
const Koa = require('koa')
const app = new Koa()
// const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const config = require('./conf/config')
const logUtil = require('./utils/logUtil')
const responseFormatter = require('./middlewares/responseFormatter')
const checkAuth = require('./middlewares/checkAuth')
const apis = require('./api/routes')
// const users = require('./routes/users')


app.keys = config.keys


// error handler
// onerror(app)

// middlewares
app.use(session(app))

app.use(bodyparser({
                       enableTypes: ['json', 'form', 'text']
                   }))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

// app.use(views(__dirname + '/views', {
//   extension: 'pug'
// }))

// logger
app.use(async (ctx, next) => {
    const start = new Date()
    try {
        await next()
        const ms = new Date() - start
        logUtil.logResponse(ctx, ms)
    } catch (error) {
        const ms = new Date() - start
        //记录异常日志
        logUtil.logError(ctx, error, ms)
    }
})

app.use(checkAuth)
app.use(responseFormatter('^/api'))

// routes
app.use(apis.routes(), apis.allowedMethods())

app.on('error', function (err, ctx) {
    console.log(err)
})

module.exports = app
