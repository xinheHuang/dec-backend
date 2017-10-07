/**
 * Created by Xinhe on 2017-09-20.
 */
const Sequelize = require('sequelize')
const User = require('../../models/user/user')
const ApiError = require('../../error/ApiError')
const ApiErrorNames = require('../../error/ApiErrorNames')
const crypto = require('../../utils/cryptoUtil')

const apis = {

    getUserInfo: { //获取userinfo
        method: 'get',
        url: '/userInfo',
        async handler(ctx, next) {
            const {UID} = ctx.session.user
            const user = await User.findById(UID)
            ctx.body = user
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

    login: { //登录
        method: 'post',
        url: '/auth/login',
        async handler(ctx, next) {
            const {username, password} = ctx.request.body
            const user = await User.findOne({
                                                where: {
                                                    username,
                                                }
                                            })
            if (!user) {
                throw new ApiError(ApiErrorNames.USER_NOT_EXIST)
            }
            if (user.password != crypto.getSha1(password)) {
                throw new ApiError(ApiErrorNames.USER_PASSWORD_WRONG)
            }
            ctx.session.user = {
                UID: user.UID,
                username,
            }
            ctx.body = {
                ...user.get({plain: true}),
                password: undefined,
            }
        }
    },

    register: { //注册
        method: 'post',
        url: '/auth/register',
        async handler(ctx, next) {
            const {username, password, position, industry, name, broker} = ctx.request.body
            const [user, created] = await User.findOrCreate({
                                                                where: {
                                                                    username
                                                                },
                                                                defaults: {
                                                                    mobile: username,
                                                                    position,
                                                                    industry,
                                                                    name,
                                                                    broker,
                                                                    password: crypto.getSha1(password),

                                                                }
                                                            })
            if (!created) {
                throw new ApiError(ApiErrorNames.USERNAME_EXIST)
            }

            ctx.session.user = {
                UID: user.UID,
                username,
            }

            ctx.body = {
                ...user.get({plain: true}),
                password: undefined,
            }
        }
    },
}

module.exports = Object.values(apis)
