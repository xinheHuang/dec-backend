/**
 * Created by Xinhe on 2017-09-20.
 */
const { ARTICLE, ARTICLE_CONCLUSION, STOCK, ARTICLE_RECOMMEND,INDUSTRY } = require('../../../db')
const ApiError = require('../../../error/ApiError')
const ApiErrorNames = require('../../../error/ApiErrorNames')
const Converter = require('../../converter')
const formatContent = (s) => s.split(new RegExp('[\r\n]'))
    .filter(d => d)

class ArticleService {

    static async getArticleById(articleId) {
        return Converter.ArticleConverter(await ARTICLE.findById(articleId))
    }

    static async getArticlesAfterTime(time) {
        return await ARTICLE.findAll({
            attributes: { exclude: ['content'] },
            where: {
                time: {
                    $gt: time
                }
            },
            include: {
                model: STOCK
            }
        })
    }

    static async getArticleRecommendsByIndustryId(id) {
        return await ARTICLE.findAll({
            attributes: { exclude: ['content'] },
            where: {
                industry_id: id
            },
            include: {
                model: ARTICLE_RECOMMEND,
                include: {
                    model: STOCK
                }
            },
            order: [
                ['time', 'DESC'],
            ]
        })
    }

    static async getStockArticles() {
        return await ARTICLE.findAll({
            attributes: { exclude: ['content'] },
            include: {
                model: STOCK,
                required: true
            }
        })
            .map((article) => Converter.ArticleConverter(article))
    }

    static async getNewestKeyConclusions() {
        const conclusion = await ARTICLE_CONCLUSION.findOne({
            attributes: ['key_conclusion'],
            order: [
                ['time', 'DESC'],
            ]
        })
        return formatContent(conclusion.key_conclusion)
    }

    static async getNewestHotspotConclusions() {
        const conclusion = await ARTICLE_CONCLUSION.findOne({
            attributes: ['hotspot_conclusion'],
            order: [
                ['time', 'DESC'],
            ]
        })
        return formatContent(conclusion.hotspot_conclusion)
    }

    static async getArticleReadNumbersByStock(time = 0,) {
        return (await  ARTICLE.sum('num_read', {
            plain: false,
            where: {
                time: {
                    $gt: time
                },
            },
            include: {
                required: true,
                model: STOCK,
            },
            group: 'STOCK.stock_id'
        })).map((articles) => {
            const { sum } = articles
            const STOCK = Object.keys(articles)
                .filter((key) => key.indexOf('STOCK.') === 0)
                .reduce((prev, key) => {
                    return {
                        ...prev,
                        [key.substr(key.indexOf('.') + 1)]: articles[key]
                    }
                }, {})
            return ({
                sum: sum,
                stock: Converter.StockConverter(STOCK)
            })
        })
    }
    
    static async getArticleReadNumberByFatherIndustry(industryId,time=0){
        return (await  ARTICLE.sum('num_read', {
            plain: false,
            where: {
                time: {
                    $gt: time
                },
            },
            include: {
                required: true,
                model: INDUSTRY,
                where:{
                    parent_industry_id:industryId
                }
            },
            group: 'INDUSTRY.industry_id'
        }))
    }
}

module.exports = ArticleService
