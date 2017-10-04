/**
 * Created by Xinhe on 2017-09-20.
 */
 const Sequelize = require('sequelize')
 const Graph = require('../models/graph/graph')
 const GraphNode = require('../models/graph/graph_node')
 const GraphComment=require('../models/graph/graph_comment')
 const Indicator = require('../models/graph/indicator')
 const GraphIndicatorNode=require('../models/graph/graph_indicator_node')
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

GraphNode.belongsToMany(Indicator, 
    {
        through: 
            {
                model:GraphIndicatorNode
            },
        foreignKey:'NID'
    }
);


Indicator.belongsToMany(GraphNode, 
    {
        through: 
            {
                model:GraphIndicatorNode
            },
        foreignKey:'IID'
    }
);
Indicator.hasMany(GraphIndicatorNode,{
    foreignKey:'IID'
})
GraphIndicatorNode.belongsTo(Indicator,{
    foreignKey:'IID'
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
                    limit: 11,
                    order: [
                        ['riqi', 'DESC'],
                    ]
                },
            })
            const comments=node.graph_comments
            ctx.body = {
                hasMore:comments.length>10,
                comments:comments.slice(0,10)
            }
        }
    },
    postGraphNodeComment: { //post comment
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

    searchIndicatorByKeyWord:{
         method: 'get',
        url: '/indicator/',
        async handler(ctx, next) {
            const {key}=ctx.request.query;
            const indicators = await Indicator.findAll({
                where:{
                    title:{
                        '$like': `%${key}%`
                    }
                }
            })
            ctx.body=indicators
        }
    },
    getNodeIndicators:{
        method:'get',
        url: '/node/:NID/indicators',
        async handler(ctx, next) {
            const {NID} = ctx.params
            const indicators = await GraphIndicatorNode.findAll({
                where:{
                        NID
                    },
                include:{
                    model:Indicator,
                }
            })
            ctx.body=indicators
        }
    },
    deleteNodeIndicators:{
        method:'delete',
        url: '/indicatorNode/:ID',
        async handler(ctx, next) {
            const {ID} = ctx.params
            const indicators = await GraphIndicatorNode.destroy({
                where:{
                        ID
                    },
            })
            ctx.body=indicators
        }
    },

    addNodeIndicators:{
        method:'post',
        url: '/indicatorNode/',
        async handler(ctx, next) {
            const warning = await GraphIndicatorNode.create({
                ...ctx.request.body,
                warn_type:0,
                upper_limit:0,
                lower_limit:0,
            })
            ctx.body=warning
        }
    },
    changeNodeIndicators:{
        method:'put',
        url: '/indicatorNode/:ID',
        async handler(ctx, next) {
            const {ID}=ctx.params;
            const {warn_type,upper_limit,lower_limit}=ctx.request.body;
            const warning = await GraphIndicatorNode.update({
                warn_type,
                upper_limit,
                lower_limit,
            },{
                where:{
                    ID,
                }
            })
            ctx.body=warning
        }
    },
    saveGraph:{
        method:'post',
        url: '/graph/',
        async handler(ctx, next) {
            const {nodes,graph} = ctx.request.body;
            const {GID}=graph;
//todo
            const updateGraph = await Graph.upsert({
                ...graph,
                riqi: new Date(),
                type:2
            },{
                where:{
                    GID,
                }
            })

            const originNodes = new Set((await GraphNode.findAll({
                where:{
                    GID    
                }
            })).map((node)=>node.NID));

            const updateNodes=await Promise.all(nodes.map((node)=>{
                originNodes.delete(node.NID);
                return GraphNode.upsert(node,{
                    where:{
                        NID:node.NID
                    }
                })
            }))


            await GraphNode.destroy({
                where:{
                    NID:{
                        $in:[...originNodes]
                    }
                }
            })
            ctx.body=updateNodes
        }
    },
}

module.exports = Object.values(apis)
