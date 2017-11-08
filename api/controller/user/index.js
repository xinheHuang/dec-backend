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
                const userId = await UserService.checkUserNamePassword(username, password)
                console.log(userId)
                ctx.session.userId = userId
                ctx.body = 'login'
            }
        },

        logout: { //logout
            method: 'post',
            url: '/auth/logout',
            async handler(ctx, next) {
                ctx.session.userId = null
                ctx.body = 'logout'
            }
        },

        register: { //注册
            method: 'post',
            url: '/auth/register',
            async handler(ctx, next) {
                const {username, password, position, industry_id, name, broker} = ctx.request.body
                const userId = await UserService.createUser(username, password, position, industry_id, name, broker)
                ctx.session.userId = userId
                ctx.body = 'register'
            }
        },
        getUserInfo: { //获取userinfo
            method: 'get',
            url: '/userInfo',
            async handler(ctx, next) {
                const userId = ctx.session.userId
                console.log(userId)
                ctx.body=await UserService.getUserInfo(userId)
            }
        },


    })
