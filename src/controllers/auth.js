const { user } = require('../models')
const responseStandart = require('../helpers/response')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const joi = require('joi')

module.exports = {
    loginUser: async (req, res) => {
        const data = await user.findOne({ where: { telphone: req.body.phone } })
        if (data !== null) {
            console.log(data.telphone);
            const compared = await bcrypt.compare(req.body.phone, data.telphone)
            if (compared === true) {
                jwt.sign({ id: data.id }, process.env.APP_KEY, (err, token) => {
                    if (err) {
                        return responseStandart(res, 'Error', { error: err.message }, 500, false)
                    } else {
                        return responseStandart(res, `Hello Readers ${data.id}`, { token })
                    }
                })
            } else {
                return responseStandart(res, 'Wrong password', {}, 400, false)
            }
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
            const salt = bcrypt.genSaltSync(10)
            const hashedPass = bcrypt.hashSync(results.phone, salt)
            const dataUser = {
                telphone: results.phone,
            }
            await user.create(dataUser)
            return responseStandart(res, 'register success', {})
        } else {
            return responseStandart(res, 'error', {}, 401, false)
        }
    }
}