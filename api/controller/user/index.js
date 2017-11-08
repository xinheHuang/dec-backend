/**
 * Created by Xinhe on 2017-09-20.
 */
const UserService = require('../../service/user')

module.exports = Object.values({
    login: { //登录
        method: 'post',
        url: '/auth/login',
        async handler(ctx, next) {
            const {username, password} = ctx.request.body
            const userId = UserService.checkUserNamePassword(username, password);
            ctx.session.userId = userId
            ctx.body = 'login'
        }
    },

    logout: { //logout
        method: 'post',
        url: '/auth/logout',
        async handler(ctx, next) {
            ctx.session.user = null
            ctx.body = 'logout'
        }
    },

        register: { //注册
            method: 'post',
            url: '/auth/register',
            async handler(ctx, next) {
                const { username, password, position, industry_id, name, broker } = ctx.request.body
                const userId =   UserService.createUser(username,password,position,industry_id,name,broker)
                ctx.session.userId = userId
                ctx.body = 'register'
            }
        },
})
