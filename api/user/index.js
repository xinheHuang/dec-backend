/**
 * Created by Xinhe on 2017-09-20.
 */
const Sequelize = require('sequelize')
const User = require('../../models/user/user')
const UserInterestStock = require('../../models/user/user_interest_stock')
const UserInterestIndustry = require('../../models/user/user_interest_industry')
const Stock = require('../../models/graph/base_stock')
const Industry = require('../../models/graph/base_industry')
const ApiError = require('../../error/ApiError')
const ApiErrorNames = require('../../error/ApiErrorNames')
const Graph = require('../../models/graph/graph')
const GraphTypes = Graph.GraphTypes
const GraphNode = require('../../models/graph/graph_node')
const crypto = require('../../utils/cryptoUtil')
const commonUtil = require('../../utils/common')


console.log(GraphTypes)
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
    getGraph: {
        method: 'get',
        url: '/graph/',
        async handler(ctx, next) {
            const { UID } = ctx.session.user
            const graphs = await Graph.findAll({
                where: {
                    UID
                },
                include: {
                    model: GraphNode,
                }
            })

            const res = graphs.map((graph) => ({
                ...graph.get({ 'plain': true }),
                graph_nodes: undefined,
                nodes:
                    graph.graph_nodes.map(({ NID, title, graph_node_relation }) => {
                        const { GNID, FNID, direction } = graph_node_relation
                        return {
                            NID,
                            title,
                            GNID,
                            FNID,
                            direction
                        }
                    })
            }))
            ctx.body = res
        }
    },
    getDraftGraphByEntity: {
        method: 'get',
        url: '/graph/draft',
        async handler(ctx, next) {
            const { UID } = ctx.session.user
            const { entity } = ctx.request.query
            let [graph, created] = await Graph.findOrCreate(
                {
                    where: {
                        UID,
                        entity,
                        type: GraphTypes.DRAFT
                    },
                    include: {
                        model: GraphNode,
                    },
                    defaults: {
                        riqi: new Date(),
                        name: '草稿版本'
                    }
                }
            )
            // console.log(graph.__proto__);
            if (created) {
                graph = await graph
                    .createGraph_node(
                        {
                            title: 'root',
                            NID: commonUtil.uuid()
                        }, {
                            through: {
                                FNID: 0,
                                direction: 'right'
                            }
                        })
                    .then(() => Graph.findById(graph.GID, {
                        include: {
                            model: GraphNode,
                        },
                    }))
                console.log(graph)
                console.log(graph.__proto__)
            }
            const res = {
                ...graph.get({ 'plain': true }),
                graph_nodes: undefined,
                nodes:
                    graph.graph_nodes.map(({ NID, title, graph_node_relation }) => {
                        const { GNID, FNID, direction } = graph_node_relation
                        return {
                            NID,
                            title,
                            GNID,
                            FNID,
                            direction
                        }
                    })
            }
            ctx.body = res
        }
    },
    postDraftGraphByEntity: {
        method: 'post',
        url: '/graph/draft',
        async handler(ctx, next) {
            const { UID } = ctx.session.user
            const { entity } = ctx.request.query
            const { nodes } = ctx.request.body
            let [graph, created] = await Graph.findOrCreate(
                {
                    where: {
                        UID,
                        entity,
                        type: GraphTypes.DRAFT
                    },
                    include: {
                        model: GraphNode,
                    },
                    defaults: {
                        riqi: new Date(),
                        name: '草稿版本'
                    }
                }
            )

            const updateNodes = await Promise.all(nodes.map((node) => GraphNode.upsert(node, {
                where: {
                    NID: node.NID
                }
            })))

            const res = await Promise.all([
                graph.update({
                    riqi: new Date(),
                }),
                graph.setGraph_nodes([])])
                .then(() =>
                    Promise.all(nodes.map(({ NID, FNID, direction }) =>
                        graph.addGraph_node(NID, {
                            through: {
                                FNID,
                                direction
                            }
                        }))))

            ctx.body = res
        }
    },

    postFinalGraph: {
        method: 'post',
        url: '/graph/final',
        async handler(ctx, next) {
            const { UID } = ctx.session.user
            const { nodes, entity, name } = ctx.request.body
            const graph = await Graph.create(
                {
                    UID,
                    entity,
                    riqi: new Date(),
                    name,
                    type: GraphTypes.FINAL
                }
            )

            await Promise.all(nodes.map((node) => GraphNode.upsert(node, {
                where: {
                    NID: node.NID
                }
            })))

            const res = await Promise.all(nodes.map(({ NID, FNID, direction }) =>
                graph.addGraph_node(NID, {
                    through: {
                        FNID,
                        direction
                    }
                })))

            ctx.body = res
        }
    },
    getIndustryInterests: {
        method: 'get',
        url: '/interests/industry',
        async handler(ctx, next) {
            const { UID } = ctx.session.user
            const user = await User.findById(UID)
            ctx.body = await user.getBase_industries()
        }

    },

    postIndustryInterests: {
        method: 'post',
        url: '/interests/industry',
        async handler(ctx, next) {
            const { UID } = ctx.session.user
            const { CID } = ctx.request.body
            const user = await User.findById(UID)
            ctx.body = await user.addBase_industry(CID)
        }

    },

    deleteIndustryInterests: {
        method: 'delete',
        url: '/interests/industry',
        async handler(ctx, next) {
            const { UID } = ctx.session.user
            const { CID } = ctx.request.body
            const user = await User.findById(UID)
            ctx.body = await user.removeBase_industry(CID)
        }
    },

    getStockInterests: {
        method: 'get',
        url: '/interests/stock',
        async handler(ctx, next) {
            const { UID } = ctx.session.user
            const user = await User.findById(UID)
            ctx.body = await user.getBase_stocks()
        }

    },

    postStockInterests: {
        method: 'post',
        url: '/interests/stock',
        async handler(ctx, next) {
            const { UID } = ctx.session.user
            const { SID } = ctx.request.body
            const user = await User.findById(UID)
            ctx.body = await user.addBase_stock(SID)
        }

    },

    deleteStockInterests: {
        method: 'delete',
        url: '/interests/stock',
        async handler(ctx, next) {
            const { UID } = ctx.session.user
            const { SID } = ctx.request.body
            const user = await User.findById(UID)
            ctx.body = await user.removeBase_stock(SID)
        }
    },

    postUserInfo: { //修改userinfo
        method: 'post',
        url: '/userInfo',
        async handler(ctx, next) {
            const { UID } = ctx.session.user
            const { userInfo } = ctx.request.body
            await User.update(userInfo,{
                where:{
                    UID
                }
            })
            ctx.body = {}
        }
    },

    getUserInfo: { //获取userinfo
        method: 'get',
        url: '/userInfo',
        async handler(ctx, next) {
            const { UID } = ctx.session.user
            const user = await User.findById(UID)
            ctx.body = {
                ...user.get({plain:true}),
                password:undefined
            }
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
            const { username, password } = ctx.request.body
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
                ...user.get({ plain: true }),
                password: undefined,
            }
        }
    },

    register: { //注册
        method: 'post',
        url: '/auth/register',
        async handler(ctx, next) {
            const { username, password, position, industry, name, broker } = ctx.request.body
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
                ...user.get({ plain: true }),
                password: undefined,
            }
        }
    },
}

module.exports = Object.values(apis)
