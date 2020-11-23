const { chat } = require('../models')
const responseStandart = require('../helpers/response')
const paging = require('../helpers/pagination')
const joi = require('joi')

module.exports = {
    createMessage: async (req, res) => {
        const {id} = req.user
        const schema = joi.object({
            messages: joi.string().required(),
            recipient: joi.string().required()
        })
        let { value: results, error } = schema.validate(req.body)
        console.log(error)
        if (!error) {
            const dataUser = {
                sender: id,
                message: results.messages,
                recipient: results.recipient
            }
            await chat.create(dataUser)
            return responseStandart(res, 'message sent', {})
        } else {
            return responseStandart(res, 'error', {}, 401, false)
        }
    },
}