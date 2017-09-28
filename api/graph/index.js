/**
 * Created by Xinhe on 2017-09-20.
 */
 const Sequelize = require('sequelize')
 const Graph = require('../models/graph/graph')
 const GraphNode = require('../models/graph/graph_node')
 
 Graph.hasMany(GraphNode, {
    foreignKey: 'GID'
})

 GraphNode.belongsTo(Graph, {
    foreignKey: 'GID'
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
}

module.exports = Object.values(apis)
