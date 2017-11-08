/**
 * Created by Xinhe on 2017-09-20.
 */
const IndustryService = require('../../service/industry')
const NewsService = require ('../../service/news')

module.exports = Object.values({
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
            ctx.body={
                news:NewsService.getNewsByIndustryId(id,pageNumber,pageSize,key)
                pageTotal:
            }
        }
    },
})
