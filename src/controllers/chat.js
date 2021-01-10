const { chat, user, message } = require('../models')
const responseStandart = require('../helpers/response')
const paging = require('../helpers/pagination')
const joi = require('joi')
const { Op } = require('sequelize')
const io = require('../App')

module.exports = {
  createChat: async (req, res) => {
    const { id } = req.user
    const recipient = req.params.id
    const schema = joi.object({
      messages: joi.string().required()
    })
    const { value: results, error } = schema.validate(req.body)
    if (!error) {
      const { messages } = results
      const dataUser = {
        sender: id,
        message: messages,
        recipient: recipient,
        isLates: true
      }
      await chat.update(
        { isLates: false },
        {
          where: {
            [Op.and]: [
              {
                [Op.or]: [{ sender: id }, { recipient: id }]
              },
              {
                [Op.or]: [{ sender: recipient }, { recipient: recipient }]
              }
            ]
          }
        }
      )
      const data = await chat.create(dataUser)
      io.emit(recipient, { id, message: messages })
      return responseStandart(res, 'message sent', { data })
    } else {
      return responseStandart(res, 'error', {}, 401, false)
    }
  },
  getListChat: async (req, res) => {
    const { id } = req.user
    const dataCount = await chat.findAndCountAll({
      where: {
        [Op.and]: [
          { [Op.or]: [{ sender: id }, { recipient: id }] },
          { isLates: 1 }]
      }
    })
    console.log(dataCount.count)
    const count = dataCount.count
    const page = paging(req, count)
    const { offset, pageInfo } = page
    const { limitData: limit } = pageInfo
    const results = await chat.findAll({
      include: [
        { model: user, as: 'recipientDetail' },
        { model: user, as: 'senderDetail' }
      ],
      limit,
      offset,
      where: {
        [Op.and]: [
          {
            [Op.or]: [{ sender: id }, { recipient: id }]
          },
          { isLates: true }
        ]
      },
      order: [['createdAt', 'desc']]
    })
    if (results) {
      return responseStandart(res, `all chat user with id ${id}`, {
        results,
        pageInfo
      })
    } else {
      return responseStandart(res, `id ${id} not found`, {}, 401, false)
    }
  },
  getChatDetail: async (req, res) => {
    const { recipients } = req.params
    const { id } = req.user
    const results = await chat.findAll({
      where: {
        [Op.or]: [
          { recipient: recipients, sender: id },
          { recipient: id, sender: recipients }
        ]
      },
      order: [['createdAt', 'desc']]
    })
    if (results) {
      return responseStandart(
        res,
        `all chat user with id ${id} and recipient ${recipients}`,
        { results }
      )
    } else {
      return responseStandart(
        res,
        `user id ${id} or recipient ${recipients}`,
        {},
        401,
        false
      )
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
