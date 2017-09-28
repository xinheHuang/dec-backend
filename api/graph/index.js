/**
 * Created by Xinhe on 2017-09-20.
 */
 const Sequelize = require('sequelize')
 const Graph = require('../models/graph/graph')
 const GraphNode = require('../models/graph/graph_node')
 const GraphComment=require('../models/graph/graph_comment')

 Graph.hasMany(GraphNode, {
    foreignKey: 'GID'
})

 GraphNode.belongsTo(Graph, {
    foreignKey: 'GID'
})

 GraphNode.hasMany(GraphComment,{
    foreignKey:'NID'
 })

GraphComment.belongsTo(GraphNode, {
    foreignKey: 'NID'
})

 const apis = {

    getGraph: { //获取graph
        method: 'get',
        url: '/graph/:GID',
        async handler(ctx, next) {
            const {GID} = ctx.params
            const graph = await Graph.findById(GID,{
                include: {
                    model: GraphNode,
                },
            })
            ctx.body = graph
        }
    },


    getGraphNodes: { //获取graph node
        method: 'get',
        url: '/graph/:GID/nodes',
        async handler(ctx, next) {
            const {GID} = ctx.params
            const nodes = await GraphNode.findAll({
                where:{
                    GID    
                }
            })
            ctx.body = nodes
        }
    },

    getGraphNodeComments: { //获取comment 10
        method: 'get',
        url: '/graph/node/:NID/comment/:from',
        async handler(ctx, next) {
            const {NID,from} = ctx.params
            const node = await GraphNode.findById(NID,{
                include: {
                    model: GraphComment,
                    offset: +from, 
                    limit: 11
                },
            })
            const comments=node.graph_comments
            ctx.body = {
                hasMore:comments.length>10,
                comments:comments.slice(0,10)
            }
        }
    },
    postGraphNodeComment: { //获取comment 10
        method: 'post',
        url: '/graph/node/:NID/comment',
        async handler(ctx, next) {
            const {NID} = ctx.params
            const comment = await GraphComment.create({
                ...ctx.request.body,
                NID,
                riqi:new Date(),
            });
            ctx.body=comment
        }
    },
}

module.exports = Object.values(apis)
