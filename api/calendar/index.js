/**
 * Created by Xinhe on 2017-09-20.
 */
 const Sequelize = require('sequelize')
 const Calendar1 = require('../models/calendar/calendar1')

 const apis = {
    getAllCalendar1: { //获取所有canlendar1
        method: 'get',
        url: '/calendar/calendar1',
        async handler(ctx, next) {
            const calendar1s = await Calendar1.findAll()
            ctx.body = calendar1s
        }
    }
}

module.exports = Object.values(apis)
