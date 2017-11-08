/**
 * Created by Xinhe on 2017-09-20.
 */
const { INDUSTRY } = require('../../../db')

class IndustryService {
    static async getSubIndustryById(id) {
        return (await INDUSTRY.findAll({
            where: {
                parent_industry_id: id
            }
        })) || []
    }

    static async getAllIndustries() {
        const industries = (await INDUSTRY.findAll()) || []
        const find = (ID) => {
            return industries
                .filter((industry) => industry.parent_industry_id === ID)
                .map((industry) => ({
                    ...industry.get({'plain':true}),
                    subs: find(industry.industry_id)
                }))
        }
        return find(0)
    }
}

module.exports = IndustryService
