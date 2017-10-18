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

  getNewsByCategory: {
    method: 'get',
    url: '/newsCategory/:CID/news',
    async handler(ctx, next) {
      const { CID } = ctx.params
      const { pageNumber, pageSize } = ctx.request.query

      // const childCID = ((await NewsCategory.findAll({
      //   where: {
      //     FCID: CID
      //   }
      // })) || []).map((c) => c.CID)
      //
      // console.log('childCID', childCID)

      const category = await NewsCategory.findById(CID)
      const [count, news] = await Promise.all([category.countNews(), category.getNews({
        attributes: { exclude: ['news_relation'] },
        offset: (pageNumber - 1) * pageSize,
        limit: +pageSize,
      })])

      ctx.body = {
        pageCount: Math.ceil(count / pageSize),
        news
      }

      //

      // const res = await NewsCategory.findAll({
      //   where: {
      //     CID: {
      //       $in: [...childCID, CID]
      //     }
      //   },
      //   include: [
      //     {
      //       model: News,
      //       attributes: { exclude: ['news_relation'] },
      //     }
      //   ],
      //   offset: (pageNumber - 1) * pageSize,
      //   limit: +pageSize,
      //
      // })

      // ctx.body = res

      // const {count,rows} = await News.findAndCount(
      //     {
      //         include: [
      //             {
      //                 model: NewsCategory,
      //                 where: {
      //                     CID: {
      //                         $in: [...childCID, CID]
      //                     }
      //                 },
      //                 attributes: {exclude: ['news_relation']},
      //                 required: true,

      //                 // duplicating: false,
      //             }
      //         ],
      //         order: [
      //             ['riqi', 'DESC'],
      //         ],
      //         distinct: true,
      //         subQuery: false,
      //         attributes: {exclude: ['content']},
      //         offset: (pageNumber - 1) * pageSize,
      //         limit: +pageSize,
      //     })
      // rows.forEach(())
      // ctx.body = {
      //     pageCount:Math.ceil(count/pageSize),
      //     news:rows
      // }
    }
  }

}

module.exports = Object.values(apis)
