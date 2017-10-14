/**
 * Created by Xinhe on 2017-09-20.
 */
const Sequelize = require('sequelize')
const User = require('../../models/user/user')
const UserInterestStock=require('../../models/user/user_interest_stock')
const UserInterestIndustry=require('../../models/user/user_interest_industry')
const Stock=require('../../models/graph/base_stock')
const Industry=require('../../models/graph/base_industry')
const ApiError = require('../../error/ApiError')
const ApiErrorNames = require('../../error/ApiErrorNames')
const crypto = require('../../utils/cryptoUtil')

User.belongsToMany(Industry, {
    foreignKey: 'UID',
    otherKey: 'CID',
    through: UserInterestIndustry,

})

Industry.belongsToMany(User, {
    through: UserInterestIndustry,
    foreignKey: 'CID',
    otherKey: 'UID'
})


User.belongsToMany(Stock, {
    foreignKey: 'UID',
    otherKey: 'SID',
    through: UserInterestStock,

})

Stock.belongsToMany(User, {
    through: UserInterestStock,
    foreignKey: 'SID',
    otherKey: 'UID'
})
const apis = {

    getIndustryInterests: {
        method: 'get',
        url: '/interests/industry',
        async handler(ctx, next) {
            const {UID} = ctx.session.user
            const user = await User.findById(UID)
            ctx.body = await user.getBase_industries();
        }

    },

    postIndustryInterests: {
        method: 'post',
        url: '/interests/industry',
        async handler(ctx, next) {
            const {UID} = ctx.session.user
            const {CID}= ctx.request.body;
            const user = await User.findById(UID)
            ctx.body = await user.addBase_industry(CID);
        }

    },

    deleteIndustryInterests:{
        method: 'delete',
        url: '/interests/industry',
        async handler(ctx, next) {
            const {UID} = ctx.session.user
            const {CID}= ctx.request.body;
            const user = await User.findById(UID)
            ctx.body = await user.removeBase_industry(CID);
        }
    },

    getStockInterests: {
        method: 'get',
        url: '/interests/stock',
        async handler(ctx, next) {
            const {UID} = ctx.session.user
            const user = await User.findById(UID)
            ctx.body = await user.getBase_stocks();
        }

    },

    postStockInterests: {
        method: 'post',
        url: '/interests/stock',
        async handler(ctx, next) {
            const {UID} = ctx.session.user
            const {SID}= ctx.request.body;
            const user = await User.findById(UID)
            ctx.body = await user.addBase_stock(SID);
        }

    },

    deleteStockInterests:{
        method: 'delete',
        url: '/interests/stock',
        async handler(ctx, next) {
            const {UID} = ctx.session.user
            const {SID}= ctx.request.body;
            const user = await User.findById(UID)
            ctx.body = await user.removeBase_stock(SID);
        }
    },



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
