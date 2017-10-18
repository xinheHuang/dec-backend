/**
 * Created by Xinhe on 2017-09-20.
 */
const Sequelize = require('sequelize')
const News = require('../../models/news/news')
const NewsCategory = require('../../models/news/newsCategory')
const NewsRelation = require('../../models/news/newsRelation')
const User = require('../../models/user/user')

const BusinessError = require('../../error/BusinessError')

News.belongsToMany(NewsCategory, {
    foreignKey: 'NID',
    through: NewsRelation,

})

NewsCategory.belongsToMany(News, {
    through: NewsRelation,
    foreignKey: 'CID'
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
                        CID, name, FCID, tier,
                        subs: find(CID)
                    }))
            }
            const res = find(0)
            ctx.body = res
        }
    },

    getNewsByCategory: {
        method: 'get',
        url: '/newsCategory/:CID/news',
        async handler(ctx, next) {
            const { CID } = ctx.params
            const { pageNumber, pageSize } = ctx.request.query

            const childCID = ((await NewsCategory.findAll({
                where: {
                    FCID: CID
                }
            })) || []).map((c) => c.CID)

            console.log('childCID', childCID)


            const res = await News.findAll({
                include: [
                    {
                        model: NewsCategory,
                        where: {
                            CID: {
                                $in: [...childCID, CID]
                            }
                        },
                        required: true,
                        duplicating: false,
                    }
                ],
                order: [
                    ['riqi', 'DESC'],
                ],
                attributes: { exclude: ['content'] },
                limit: 10,
                offset: 0
            })
            // const res = await NewsCategory.findAll({
            //     where: {
            //         CID: {
            //             $in: [...childCID, CID]
            //         }
            //     },
            //     include: [
            //         {
            //             model: NewsRelation,
            //             include: [{
            //                 model: News,
            //                 attributes: { exclude: ['content'] },
            //                 }
            //             ],
            //             order: [
            //                 [News,'riqi', 'DESC'],
            //             ],
            //             offset: (pageNumber - 1) * pageSize,
            //             limit: +pageSize,
            //         }
            //     ]
            // })
            ctx.body = res
            // const category = await NewsCategory.findById(CID)
            // const [news, count] = await Promise.all([category.getNews({
            //     attributes: { exclude: ['content'] },
            //     offset: (pageNumber - 1) * pageSize,
            //     limit: +pageSize,
            //     order: [
            //         ['riqi', 'DESC'],
            //     ]
            // }), category.countNews()])
            // ctx.body = {
            //     news,
            //     totalPage:Math.ceil(count/pageSize)
            // }
        }
    }

}

module.exports = Object.values(apis)
