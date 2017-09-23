/**
 * Created by Xinhe on 2017-09-20.
 */
const Sequelize = require('sequelize')
const Article = require('../models/article')
const Conclusion = require('../models/conclusion')
const Category = require('../models/category')
const Recommend = require('../models/recommend')
const People = require('../models/people')
const Relation = require('../models/relation')
Article.hasMany(Recommend, {
    foreignKey: 'YID'
})

Recommend.belongsTo(Article, {
    foreignKey: 'YID'
})

Relation.hasMany(Article, {
    foreignKey:'topic'
})

Article.belongsTo(Relation, {
    foreignKey: 'topic'
})

const apis = {
    getAllArticles: { //获取最近七天的文章
        method: 'get',
        url: '/market/articles',
        async handler(ctx, next) {
            const last7Day = new Date()
            last7Day.setDate(new Date().getDate() - 7) //七天之内
            const articles = await Article.findAll(
                {
                    where: {
                        riqi: {
                            $gt: last7Day
                        }
                    }
                })

            ctx.body = articles
        }
    }
    ,
    getArticlesByIndustry: { //获取推荐文章
        method: 'get',
        url: '/market/industry/:industry/articles',
        async handler(ctx, next) {
            const {industry} = ctx.params
            const articles = await Article.findAll(
                {
                    where: {
                        industry
                    },
                    include: {
                        model: Recommend,
                    },
                    order: [
                        ['riqi', 'DESC'],
                    ]
                })

            ctx.body = articles
        }
    }
    ,
    getPeopleByIndustry: { //获取people
        method: 'get',
        url: '/market/industry/:industry/people',
        async handler(ctx, next) {
            const {industry} = ctx.params
            const people = await People.findAll(
                {
                    where: {
                        industry
                    },
                })

            ctx.body = people
        }
    }

    ,
    getConclusion: { //获取最新的结论
        method: 'get',
        url: '/market/conclusion',
        async handler(ctx, next) {
            const formatContent = (s) => s.split(new RegExp('[\r\n]'))
                                          .filter(d => d)
            const conclusion = await Conclusion.findOne(
                {
                    order: [
                        ['riqi', 'DESC'],
                    ]
                })
            conclusion.content1 = formatContent(conclusion.content1)
            conclusion.content2 = formatContent(conclusion.content2)
            ctx.body = conclusion
        }
    }

    ,
    getCategories: { //获取一级行业
        method: 'get',
        url: '/market/categories',
        async handler(ctx, next) {
            const categories = await Category.findAll(
                {
                    where: {
                        FCID: 0
                    }
                })
            ctx.body = categories
        }
    }

    ,
    getSubCategories: { //获取一级行业
        method: 'get',
        url: '/market/categories/:cid',
        async handler(ctx, next) {
            const {cid} = ctx.params
            const categories = await Category.findAll(
                {
                    where: {
                        FCID: cid
                    }
                })
            ctx.body = categories
        }
    }
    ,
    getTotalReadNumbers: {
        method: 'get',
        url: '/market/readNumbers',
        async handler(ctx, next) {
            const last7Day = new Date()
            last7Day.setDate(new Date().getDate() - 7) //七天之内
            const articles = await  Article.sum('num_read', {
                plain:false,
                where: {
                    riqi: {
                        $gt: last7Day
                    }
                },
                include: {
                    model: Relation,
                },
                 group: 'topic'
            })
            ctx.body = articles
        }
    }
}

module.exports = Object.values(apis)
