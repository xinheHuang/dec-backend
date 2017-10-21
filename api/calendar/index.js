/**
 * Created by Xinhe on 2017-09-20.
 */
const Sequelize = require('sequelize')
const Calendar1 = require('../../models/calendar/calendar1')  //数据
const Calendar2 = require('../../models/calendar/calendar2') //日程

const apis = {
    getAllCalendar1: { //获取所有canlendar1
        method: 'get',
        url: '/calendar/calendar1',
        async handler(ctx, next) {
            ctx.body = await Calendar1.findAll()
        }
    },
    getAllCalendar2: { //获取所有canlendar1
        method: 'get',
        url: '/calendar/calendar2',
        async handler(ctx, next) {
            const { date } = ctx.request.query
            if (!date) { //all calendar
                ctx.body = await Calendar2.findAll()
                return
            }
            const today=new Date(date);
            const tomorrow=new Date(date);
            tomorrow.setDate(today.getDate()+1);
            console.log(tomorrow)
            ctx.body = await Calendar2.findAll({
                // where: Sequelize.where(Sequelize.fn('TO_DAYS', Sequelize.col('riqi_detail')), '=', Sequelize.fn('TO_DAYS', date)),
                where:{
                    riqi_detail:{
                        $gte:today,
                        $lte:tomorrow
                    }
                }
            })
        }
    },

}

module.exports = Object.values(apis)
