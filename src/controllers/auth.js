const { user } = require('../models')
const responseStandart = require('../helpers/response')
const jwt = require('jsonwebtoken')
const joi = require('joi')

module.exports = {
    loginUser: async (req, res) => {
        const data = await user.findOne({ where: { telphone: req.body.phone } })
        console.log(data)
        if (data !== null) {
            jwt.sign({ id: data.id }, process.env.APP_KEY, (err, token) => {
                if (err) {
                    return responseStandart(res, 'Error', { error: err.message }, 500, false)
                } else {
                    return responseStandart(res, `Hello moconers ${data.id}`, { token })
                }
            })
        } else {
            return responseStandart(res, 'wrong email or password', {}, 400, false)
        }
    },
    registrasiUser: async (req, res) => {
        const schema = joi.object({
            phone: joi.string().required()
        })
        let { value: results, error } = schema.validate(req.body)
        if (!error) {
            const dataUser = {
                telphone: results.phone,
            }
            const data = await user.create(dataUser)
            if (data !== null) {
                jwt.sign({ id: data.id }, process.env.APP_KEY, (err, token) => {
                    console.log(token);
                    if (err) {
                        return responseStandart(res, 'Error', { error: err.message }, 500, false)
                    } else {
                        return responseStandart(res, `Hello mocconers ${data.id}`, { token })
                    }
                })
            } else {
                return responseStandart(res, 'wrong email or password', {}, 400, false)
            }
        } else {
            return responseStandart(res, 'error', {}, 401, false)
        }
    }
}