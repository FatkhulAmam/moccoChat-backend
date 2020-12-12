const { user } = require('../models')
const responseStandart = require('../helpers/response')
const jwt = require('jsonwebtoken')
const joi = require('joi')

module.exports = {
  registrasiUser: async (req, res) => {
    const schema = joi.object({
      phone: joi.string().required()
    })
    const { value: results, error } = schema.validate(req.body)
    const dataLogin = await user.findOne({ where: { telphone: results.phone } })
    if (dataLogin !== null) {
      jwt.sign({ id: dataLogin.id, isLogin: true }, process.env.APP_KEY, (err, token) => {
        if (err) {
          return responseStandart(res, 'Error', { error: err.message }, 500, false)
        } else {
          return responseStandart(res, `welcome back moconers ${dataLogin.id}`, { token })
        }
      })
    } else {
      if (!error) {
        const dataUser = {
          telphone: results.phone
        }
        const data = await user.create(dataUser)
        if (data !== null) {
          jwt.sign({ id: data.id }, process.env.APP_KEY, (err, token) => {
            console.log(token)
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
}
