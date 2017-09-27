/**
 * Created by Xinhe on 2017-09-20.
 */
 const Sequelize = require('sequelize')
 const Calendar1 = require('../models/calendar/calendar1')
 const Calendar2 = require('../models/calendar/calendar2')
 
 const apis = {
    getAllCalendar1: { //获取所有canlendar1
        method: 'get',
        url: '/calendar/calendar1',
        async handler(ctx, next) {
            const calendar1s = await Calendar1.findAll()
            ctx.body = calendar1s
        }
    },
    getAllCalendar2: { //获取所有canlendar1
        method: 'get',
        url: '/calendar/calendar2',
        async handler(ctx, next) {
            const calendar2s = await Calendar2.findAll()
            ctx.body = calendar2s
        }
    }
}

module.exports = Object.values(apis)
