/**
 * Created by Xinhe on 2017/10/7.
 */

const authUrl = new RegExp('^/api/auth/')
const checkAuth = async (ctx, next) => {
    if (authUrl.test(ctx.originalUrl) || ctx.session.userId) {
        try {
            await next()
        } catch (error) {
            throw error
        }
    }
    else {
        ctx.status = 403
    }
}

module.exports = checkAuth