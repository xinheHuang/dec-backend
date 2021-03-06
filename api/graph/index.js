/**
 * Created by Xinhe on 2017-09-20.
 */
const Sequelize = require('sequelize')
const Graph = require('../../models/graph/graph')
const GraphNode = require('../../models/graph/graph_node')
const GraphComment = require('../../models/graph/graph_comment')
const GraphIndicator = require('../../models/graph/graph_indicator')
const Indicator = require('../../models/graph/indicator')
const GraphNodeRelation = require('../../models/graph/graph_node_relation')
const User = require('../../models/user/user')

const Stock = require('../../models/graph/base_stock')
const Industry = require('../../models/graph/base_industry')

const BusinessError = require('../../error/BusinessError')

Graph.belongsToMany(GraphNode, {
    foreignKey: 'GID',
    through: GraphNodeRelation,

})

GraphNode.belongsToMany(Graph, {
    through: GraphNodeRelation,
    foreignKey: 'NID'
})

GraphNode.hasMany(GraphComment, {
    foreignKey: 'NID'
})

GraphComment.belongsTo(GraphNode, {
    foreignKey: 'NID'
})

GraphNodeRelation.belongsToMany(Indicator, {
    foreignKey: 'GNID',
    through: GraphIndicator,
})

Indicator.belongsToMany(GraphNodeRelation, {
    foreignKey: 'IID',
    through: GraphIndicator,
})

User.hasMany(GraphComment, {
    foreignKey: 'UID'
})
GraphComment.belongsTo(User, {
    foreignKey: 'UID'
})


const apis = {
    searchInterestsAndStocksByKeyWord: {
        method: 'get',
        url: '/interests/',
        async handler(ctx, next) {
            const { key } = ctx.request.query
            const stocksPromise = Stock.findAll({
                where: {
                    $or: [
                        {
                            code: {
                                '$like': `%${key}%`
                            }
                        },
                        {
                            name: {
                                '$like': `%${key}%`
                            }
                        }
                    ]

                }
            })
            const industryPromise = Industry.findAll({
                where: {
                    name: {
                        '$like': `%${key}%`
                    }
                }
            })
            const res = await Promise.all([stocksPromise, industryPromise])
                .then(([stocks, industries]) => {
                    return {
                        stocks,
                        industries
                    }
                })
            ctx.body = res
        }
    },
    getGraphById: { //获取graph
        method: 'get',
        url: '/graph/:GID',
        async handler(ctx, next) {
            const { GID } = ctx.params
            const graph = await Graph.findById(GID)
            const nodes = await graph.getGraph_nodes()
                .map(({ NID, title, graph_node_relation }) => {
                    const { GNID, FNID, direction } = graph_node_relation
                    return {
                        NID,
                        title,
                        GNID,
                        FNID,
                        direction
                    }
                })
            ctx.body = {
                ...graph.get({ 'plain': true }),
                nodes
            }
        }
    },
    getGraphNodeComments: { //获取comment 10
        method: 'get',
        url: '/node/:NID/comment/:from',
        async handler(ctx, next) {
            const { NID, from } = ctx.params
            const node = await GraphNode.findById(NID, {
                include: {
                    model: GraphComment,
                    include: {
                        model: User
                    },
                    offset: +from,
                    limit: 11,
                    order: [
                        ['riqi', 'DESC'],
                    ]
                },
            })
            if (!node) {
                throw new BusinessError('node不存在')
            }
            const comments = (node.graph_comments || []).map((comment) => {
                return {
                    ...comment.get({ plain: true }),
                    user: undefined,
                    author: comment.user.name,
                    industry: comment.user.industry
                }
            })
            ctx.body = {
                hasMore: comments.length > 10,
                comments: comments.slice(0, 10)
            }
        }
    },
    postGraphNodeComment: { //post comment
        method: 'post',
        url: '/node/:NID/comment',
        async handler(ctx, next) {
            const { UID } = ctx.session.user
            const { NID } = ctx.params
            const { content } = ctx.request.body
            const node = await GraphNode.findById(NID)
            if (!node) {
                throw new BusinessError('node不存在')
            }
            const comment = await node.createGraph_comment(
                {
                    UID,
                    content,
                    riqi: new Date(),
                }
            )
            const user = await comment.getUser()
            ctx.body = {
                ...comment.get({ plain: true }),
                author: user.name,
                industry: user.industry
            }
        }
    },

    searchIndicatorByKeyWord: {
        method: 'get',
        url: '/indicator/',
        async handler(ctx, next) {
            const { key } = ctx.request.query
            const indicators = await Indicator.findAll({
                where: {
                    title: {
                        '$like': `%${key}%`
                    }
                }
            })
            ctx.body = indicators
        }
    },
    getNodeIndicators: {
        method: 'get',
        url: '/graphNode/:GNID/indicators',
        async handler(ctx, next) {
            const { GNID } = ctx.params
            const gnode = await GraphNodeRelation.findById(GNID)
            if (!gnode) {
                throw new BusinessError('graph node relation不存在')
            }
            // console.log(gnode.__proto__)
            const indicators = await gnode.getIndicators()
                .map(indicator => indicator.get({ 'plain': true }))
                .map((indicator) => {
                    return {
                        ...indicator,
                        graph_indicator: undefined,
                        ...indicator.graph_indicator
                    }
                })
            ctx.body = indicators
        }
    },

    addNodeIndicators: {
        method: 'post',
        url: '/graphNode/:GNID/indicators/',
        async handler(ctx, next) {
            const { GNID } = ctx.params
            const { IID } = ctx.request.body
            const gnode = await GraphNodeRelation.findById(GNID)
            // console.log(gnode.__proto__)
            const indicator = await Indicator.findById(IID)
            const m = await gnode.addIndicator(indicator, {
                through: {
                    warn_type: 0,
                    upper_limit: 0,
                    lower_limit: 0,
                }
            })
            console.log(graphIndicator[0])
            ctx.body = {
                ...graphIndicator[0],
                ...indicator.get({ plain: true }),
            }
        }
    },


    changeNodeIndicators: {
        method: 'put',
        url: '/graphIndicator/:ID',
        async handler(ctx, next) {
            const { ID } = ctx.params
            const { warn_type, upper_limit, lower_limit } = ctx.request.body
            const warning = await GraphIndicator.update({
                warn_type,
                upper_limit,
                lower_limit,
            }, {
                where: {
                    ID,
                }
            })
            ctx.body = warning
        }
    },

    deleteNodeIndicators: {
        method: 'delete',
        url: '/graphIndicator/:ID',
        async handler(ctx, next) {
            const { ID } = ctx.params
            const indicators = await GraphIndicator.destroy({
                where: {
                    ID
                },
            })
            ctx.body = indicators
        }
    },


    saveGraph: {
        method: 'post',
        url: '/graph/draft',
        async handler(ctx, next) {
            const { entity, nodes, graph } = ctx.request.body
            const { GID } = graph
//todo
            const draftGraph = await Graph.findOrCreate({
                where: {
                    //author: ? todo
                    type: 2,
                    entity
                }
            })
            const updateDraftGraph = await draftGraph.update({
                riqi: new Date(),
            })


            // const updateGraph = await Graph.upsert({
            //                                            ...graph,
            //                                            riqi: new Date(),
            //                                            type: 2
            //                                        }, {
            //                                            where: {
            //                                                GID,
            //                                            }
            //                                        })

            const originNodes = new Set((await GraphNode.findAll({
                where: {
                    GID
                }
            })).map((node) => node.NID))

            const updateNodes = await Promise.all(nodes.map((node) => {
                originNodes.delete(node.NID)
                return GraphNode.upsert(node, {
                    where: {
                        NID: node.NID
                    }
                })
            }))


            await GraphNode.destroy({
                where: {
                    NID: {
                        $in: [...originNodes]
                    }
                }
            })
            ctx.body = updateNodes
        }
    },

    submitGraph: {
        method: 'post',
        url: '/graph/',
        async handler(ctx, next) {
            const { nodes, graph } = ctx.request.body
            const { GID } = graph
//todo
            const updateGraph = await Graph.upsert({
                ...graph,
                riqi: new Date(),
                type: 2
            }, {
                where: {
                    GID,
                }
            })

            const originNodes = new Set((await GraphNode.findAll({
                where: {
                    GID
                }
            })).map((node) => node.NID))

            const updateNodes = await Promise.all(nodes.map((node) => {
                originNodes.delete(node.NID)
                return GraphNode.upsert(node, {
                    where: {
                        NID: node.NID
                    }
                })
            }))


            await GraphNode.destroy({
                where: {
                    NID: {
                        $in: [...originNodes]
                    }
                }
            })
            ctx.body = updateNodes
        }
    },

}

module.exports = Object.values(apis)
