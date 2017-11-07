/**
 * Created by Xinhe on 2017-09-20.
 */
const Sequelize = require('sequelize')
const News = require('../../models/news/news')
const NewsCategory = require('../../models/news/newsCategory')
const NewsRelation = require('../../models/news/newsRelation')
const User = require('../../models/user/user')

const ApiError = require('../../error/ApiError')
const ApiErrorNames = require('../../error/ApiErrorNames')

News.belongsToMany(NewsCategory, {
    foreignKey: 'NID',
    through: NewsRelation,

})

NewsCategory.belongsToMany(News, {
    through: NewsRelation,
    foreignKey: 'CID'
})

NewsRelation.hasOne(News, {
    foreignKey: 'NID',
})

// NewsCategory.hasMany(NewsRelation, {
//     foreignKey: 'CID'
// })
// NewsRelation.belongsTo(News, {
//     foreignKey: 'NID',
// })

const apis = {

    getNewsCategories: {
        method: 'get',
        url: '/newsCategories',
        async handler(ctx, next) {
            const categories = (await NewsCategory.findAll()) || []
            const find = (ID) => {
                return categories
                    .filter((category) => category.FCID == ID)
                    .map(({ CID, name, FCID, tier }) => ({
                        CID,
                        name,
                        FCID,
                        tier,
                        subs: find(CID)
                    }))
            }
            const res = find(0)
            ctx.body = res
        }
    },

    getNewsPageCountByCategory: {
        method: 'get',
        url: '/newsCategory/:CID/pageCount',
        async handler(ctx, next) {
            const { CID } = ctx.params
            const { pageSize ,key} = ctx.request.query
            const query={}
            if (key){
                query.where={
                    $or: [
                        {
                            abstract: {
                                '$like': `%${key}%`
                            }
                        },
                        {
                            title: {
                                '$like': `%${key}%`
                            }
                        }
                    ]
                }
            }


            if (CID == 0) {
                const count = await News.count(query)
                ctx.body = {
                    pageCount: Math.ceil(count / pageSize),
                }
                return
            }
            const category = await NewsCategory.findById(CID)
            if (!category) {
                throw new ApiError(ApiErrorNames.NOT_FOUND)
            }

            const count = await category.countNews(query)

            ctx.body = {
                pageCount: Math.ceil(count / pageSize),
            }

        }
    },
    getNewsByCategory: {
        method: 'get',
        url: '/newsCategory/:CID/news',
        async handler(ctx, next) {
            const { CID } = ctx.params
            const { pageNumber, pageSize,key } = ctx.request.query
            const query = {
                attributes: { exclude: ['content'] },
                order: [
                    ['riqi', 'DESC'],
                ],
                offset: (pageNumber - 1) * pageSize,
                limit: +pageSize,
            }

            if (key){
                query.where={
                    $or: [
                        {
                            abstract: {
                                '$like': `%${key}%`
                            }
                        },
                        {
                            title: {
                                '$like': `%${key}%`
                            }
                        }
                    ]
                }
            }
            if (CID == 0) {
                const news = await News.findAll(query)
                ctx.body = {
                    news
                }
                return
            }


            const category = await NewsCategory.findById(CID)
            if (!category) {
                throw new ApiError(ApiErrorNames.NOT_FOUND)
            }
            const news = await category.getNews(query)

            ctx.body = {
                news
            }
        }
    }
}

module.exports = Object.values(apis)
