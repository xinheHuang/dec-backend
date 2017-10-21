/**
 * Created by Xinhe on 2017-09-20.
 */
const Sequelize = require('sequelize')
const ApiError = require('../../error/ApiError')
const ApiErrorNames = require('../../error/ApiErrorNames')

const Graph = require('../../models/search/graph')
const GraphNode = require('../../models/search/graph_node')
const GraphComment = require('../../models/search/graph_comment')
const GraphIndicator = require('../../models/search/graph_indicator')
const GraphNodeRelation = require('../../models/search/graph_node_relation')

const News = require('../../models/search/news')

const ReportImage = require('../../models/search/report_image')
const Report = require('../../models/search/report')

const IndicatorComment = require('../../models/search/indicator_comment')
const IndicatorInfo = require('../../models/search/indicator_info')
const IndicatorValue = require('../../models/search/indicator_value')

const SearchList = require('../../models/search/search_list')


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


ReportImage.belongsTo(Report, {
    foreignKey: 'fileID',
    targetKey: 'fileID',
})

IndicatorComment.belongsTo(IndicatorInfo, {
    foreignKey: 'ID_tong',
    targetKey: 'ID_tong',
})
IndicatorInfo.hasMany(IndicatorValue, {
    foreignKey: 'ID_tong',
    sourceKey: 'ID_tong'
})

SearchList.belongsTo(News, {
    foreignKey: 'ID_news'
})
SearchList.belongsTo(IndicatorComment, {
    foreignKey: 'ID_indicator',
})
SearchList.belongsTo(ReportImage, {
    foreignKey: 'ID_report_image',
})
SearchList.belongsTo(Graph, {
    foreignKey: 'ID_graph',
})

const apis = {

    searchByKey: {
        method: 'get',
        url: '/search',
        async handler(ctx, next) {
            const {CID} = ctx.params
            const {pageNumber, pageSize, key} = ctx.request.query
            const query = {
                where: {
                },
                order: [
                    ['riqi', 'DESC'],
                    ['ID','DESC']
                ],
                offset: (pageNumber - 1) * pageSize,
                limit: +pageSize,
            }

            if (key) {
                query.where.keywords={
                        '$like': `%${key}%`
                }
            }
            const res = await SearchList.findAll(query)
            const details = res.map((item) => {
                if (item.ID_graph) {
                    item.type = 'graph'
                    return item.getGraph({
                                             include: [
                                                 {
                                                     model: GraphNode
                                                 }
                                             ]
                                         })
                }
                if (item.ID_indicator) {
                    item.type = 'indicator'
                    return item.getIndicator_comment({
                                                         include: [{
                                                             model: IndicatorInfo,
                                                             include: [
                                                                 {
                                                                     model: IndicatorValue
                                                                 }
                                                             ]
                                                         }]
                                                     })
                }
                if (item.ID_news) {
                    item.type = 'news'
                    return item.getNews()
                }
                if (item.ID_report_image) {
                    item.type = 'report'
                    return item.getReport_image({
                                                    include: [
                                                        {
                                                            model: Report
                                                        }
                                                    ]
                                                })
                }
            })
            ctx.body = (await Promise.all(details)).map((data, index) => {
                const {ID, type, riqi} = res[index]
                return ({
                    ID,
                    type,
                    riqi,
                    data
                })
            })


        }
    }
}

module.exports = Object.values(apis)
