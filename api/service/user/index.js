/**
 * Created by Xinhe on 2017-09-20.
 */
const {USER} = require('../../../db')
const ApiError = require('../../../error/ApiError')
const ApiErrorNames = require('../../../error/ApiErrorNames')

class UserService {
    static async checkUserNamePassword(username, password) {
        const user = await USER.findOne({
                                            where: {
                                                username,
                                            }
                                        })
        if (!user) {
            throw new ApiError(ApiErrorNames.USER_NOT_EXIST)
        }
        if (user.password != crypto.getSha1(password)) {
            throw new ApiError(ApiErrorNames.USER_PASSWORD_WRONG)
        }
        user.update({
                        last_login_time:  new Date().getTime()
                    })
        return user.user_id
    }

    static async createUser(username, password, position, industry_id, name, broker) {
        const time = new Date()
        let [user, created] = await USER.findOrCreate({
                                                            where: {
                                                                username
                                                            },
                                                            defaults: {
                                                                //todo need fix
                                                                mobile: username,
                                                                position,
                                                                industry_id,
                                                                name,
                                                                broker,
                                                                password: crypto.getSha1(password),
                                                                register_time: time.getTime(),
                                                                last_login_time: time.getTime()
                                                            }
                                                        })
        if (!created) {
            throw new ApiError(ApiErrorNames.USERNAME_EXIST)
        }
        if (!user.userId) {
            user = await USER.findOne({
                                                where: {
                                                    username,
                                                }
                                            })
        }
        return user.user_id
    }
}

module.exports = UserService
