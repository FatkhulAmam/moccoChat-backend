const { chat, user } = require('../models')
const responseStandart = require('../helpers/response')
const paging = require('../helpers/pagination')
const joi = require('joi')

module.exports = {
    createChat: async (req, res) => {
        const { id } = req.user
        const schema = joi.object({
            messages: joi.string().required(),
            recipient: joi.string().required()
        })
        let { value: results, error } = schema.validate(req.body)
        const dbPhone = await user.findByPk(id)
        if (parseInt(results.recipient) === dbPhone.telphone) {
            return responseStandart(res, `cannot sent self message`, {}, 401, false)
        } else {
            if (!error) {
                const dataUser = {
                    sender: id,
                    message: results.messages,
                    recipient: results.recipient
                }
                const data = await chat.create(dataUser)
                return responseStandart(res, 'message sent', {data})
            } else {
                return responseStandart(res, 'error', {}, 401, false)
            }
        }
    },
    getAllUserChat: async (req, res) => {
        const { id } = req.user
        const results = await chat.findAll({
            include: [
                {model: user, as: 'recipientDetail'}
            ],
            where: {sender: id},
            order: [
                ['createdAt', `desc`]
            ]})
        if (results) {
            return responseStandart(res, `all chat user with id ${id}`, { results })
        } else {
            return responseStandart(res, `id ${id} not found`, {}, 401, false)
        }
    },
    getChatDetail: async (req, res) => {
        const {recipients} = req.params
        console.log(recipients);
        const { id } = req.user
        const results = await chat.findAll({where: {recipient: recipients, sender: id}})
        if (results) {
            return responseStandart(res, `all chat user with id ${id} and recipient ${recipients}`, { results })
        } else {
            return responseStandart(res, `user id ${id} or recipient ${recipients}`, {}, 401, false)
        }
    },
    deleteMessage: async (req, res) => {
        const { id } = req.params
        const results = await message.findByPk(id)
        if (results) {
            await results.destroy()
            return responseStandart(res, `delete message id ${id} successfully`, {})
        } else {
            return responseStandart(res, `message ${id} not found`, {}, 401, false)
        }
    }
}