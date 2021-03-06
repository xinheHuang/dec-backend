/**
 * Created by Xinhe on 2017-09-20.
 */
const IndustryService = require('../../service/industry')
const NewsService = require('../../service/news')
const AnalystService = require('../../service/analyst')
const ArticleService = require('../../service/article')

const getLast7DayTime=()=>{
    const last7Day = new Date()
    last7Day.setHours(0, 0, 0, 0)
    last7Day.setDate(last7Day.getDate() - 7) //七天之内 
    // return last7Day.getTime();
    //todo 用途测试
    return 0;
}

module.exports = Object.values(
    {
        getIndustries: {
            url: '/industries',
            method: 'get',
            async handler(ctx) {
                ctx.body = await IndustryService.getAllIndustries()
            }
        },

        getIndustriesById: {
            url: '/industries/:id',
            method: 'get',
            async handler(ctx) {
                const { id } = ctx.params
                ctx.body = await IndustryService.getSubIndustryById(id)
            }
        },

        getNewsByIndustry: {
            url: '/industry/:id/news',
            method: 'get',
            async handler(ctx) {
                const { id } = ctx.params
                const { pageNumber, pageSize, key } = ctx.request.query
                ctx.body = {
                    news: await NewsService.getNewsByIndustryId(id, pageNumber, pageSize, key)
                }
            }
        },

        getNewsPageCountByIndustry: {
            method: 'get',
            url: '/industry/:id/pageCount',
            async handler(ctx) {
                const { id } = ctx.params
                const { pageSize, key } = ctx.request.query
                ctx.body = {
                    pageCount: await NewsService.getNewsTotalPageCountByIndustryId(id, pageSize, key)
                }

            }
        },

        searchInterestsAndStocksByKeyWord: {
            method: 'get',
            url: '/interests/',
            async handler(ctx) {
                const { key } = ctx.request.query
                ctx.body = await IndustryService.searchInterestsAndStocksByKeyWord(key)
            }
        },

        searchByKey: {  //搜索所有推送内容
            method: 'get',
            url: '/search',
            async handler(ctx) {
                const { pageNumber, pageSize, key } = ctx.request.query
                ctx.body = await   IndustryService.searchByKey(key, pageNumber, pageSize)
            }
        },

        getAnalystByIndustry: { //获取analyst
            method: 'get',
            url: '/industry/:id/analyst',
            async handler(ctx) {
                const { id } = ctx.params
                ctx.body = await AnalystService.getAnalystByIndustryId(id)
            }
        },

        getNewestHotSpotConclusion: { //获取最新的热点结论
            method: 'get',
            url: '/conclusions/hotspot',
            async handler(ctx) {
                ctx.body = await ArticleService.getNewestHotspotConclusions()
            }
        },

        getNewestKeyConclusion: { //获取最新的核心结论
            method: 'get',
            url: '/conclusions/key',
            async handler(ctx) {
                ctx.body = await ArticleService.getNewestKeyConclusions()
            }
        },


        getArticlesInLast7Days: { //获取最近七天的文章
            method: 'get',
            url: '/articles',
            async handler(ctx,) {
                ctx.body = await ArticleService.getArticlesAfterTime(getLast7DayTime())
            }
        },
        getArticleById: { //获取文章by Id
            method: 'get',
            url: '/article/:id',
            async handler(ctx,) {
                const { id } = ctx.params
                ctx.body = await ArticleService.getArticleById(id)
            }
        },
        getArticleRecommendsByIndustry:{  //获取行业下的文章
            method: 'get',
            url: '/industry/:id/articles',
            async handler(ctx, ) {
                const {id} = ctx.params
                ctx.body = await ArticleService.getArticleRecommendsByIndustryId(id);
            }
        },

        getStockArticles:{
            method: 'get',
            url: '/stock/articles',
            async handler(ctx, ) {
                ctx.body = await ArticleService.getStockArticles()
            }
        },

// todo time by input
        getStockArticleReadNumbers:{
            method: 'get',
            url: '/stock/articles/readNumbers',
            async handler(ctx, ) {
                ctx.body = await ArticleService.getArticleReadNumbersByStock(getLast7DayTime())
            }
        },
        getArticleReadNumbersByIndustry:{
            method: 'get',
            url: '/industry/:id/articles/readNumbers',
            async handler(ctx, ) {
                const {id} = ctx.params
                ctx.body = await ArticleService.getArticleReadNumberByFatherIndustry(id,getLast7DayTime())
            }
        }

    })
