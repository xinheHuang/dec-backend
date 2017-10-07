/**
 * Created by Xinhe on 2017-09-20.
 */
 const Sequelize = require('sequelize')
 const Article = require('../../models/market/article')
 const Conclusion = require('../../models/market/conclusion')
 const Category = require('../../models/market/category')
 const Recommend = require('../../models/market/recommend')
 const People = require('../../models/market/people')
 const Relation = require('../../models/market/relation')
 Article.hasMany(Recommend, {
    foreignKey: 'YID'
})

 Recommend.belongsTo(Article, {
    foreignKey: 'YID'
})

 Relation.hasMany(Article, {
    foreignKey:'topic'

})

 Relation.hasMany(Recommend, {
    foreignKey:'code'
})

  Recommend.belongsTo(Relation, {
    foreignKey: 'code'
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
                attributes:['YID','industry','broker','riqi','title','topic','num_read','num_like'],
                where: {
                    riqi: {
                        $gt: last7Day
                    }
                },
                include: {
                    model: Relation,
                },
            })

            ctx.body = articles
        }
    },
    getArticleById: { //获取文章
       method: 'get',
        url: '/market/article/:id',
        async handler(ctx, next) {
            const {id} = ctx.params
            const article = await Article.findById(id)
            ctx.body = article
        }
    },
    getArticlesByIndustry: { //获取推荐文章
        method: 'get',
        url: '/market/industry/:industry/articles',
        async handler(ctx, next) {
            const {industry} = ctx.params
            const articles = await Article.findAll(
            {
                attributes:['YID','industry','broker','riqi','title','topic','num_read','num_like'],
                where: {
                    industry
                },
                include: [{
                    model: Recommend,
                    include: [{
                        model: Relation,
                    }],
                }],
                order: [
                ['riqi', 'DESC'],
                ]
            })

            ctx.body = articles
        }
    },
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
    },
    getTotalReadNumbersLast7Days: {
        method: 'get',
        url: '/market/readNumbersLast7Days',
        async handler(ctx, next) {
            const last7Day = new Date()
            last7Day.setDate(new Date().getDate() - 7) //七天之内
            const articles = await  Article.sum('num_read', {
                plain:false,
                where: {
                    riqi: {
                        $gt: last7Day
                    },
                    topic:{
                        $and: [{'$ne':''},{'$ne':null}]
                    }
                },
                include: {
                    model: Relation,
                },
                group: 'topic'
            })
            ctx.body = articles
        }
    },
    getArticleRelations: {
        method: 'get',
        url: '/market/articleRelations',
        async handler(ctx, next) {
            const articles = await  Article.findAll({
                plain:false,
                attributes:['YID','industry','num_read','riqi'],
                where:{
                    topic:{
                        $and: [{'$ne':''},{'$ne':null}]
                    }
                },
                include: {
                    model: Relation,
                },
            })
            ctx.body = articles
        }
    }
}

module.exports = Object.values(apis)
