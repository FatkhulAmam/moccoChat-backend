const { chat, user, message } = require('../models')
const responseStandart = require('../helpers/response')
const paging = require('../helpers/pagination')
const joi = require('joi')
const { Op } = require('sequelize')
const FCM = require('fcm-node')
const io = require('../App')
const { APP_FCM_SERVERKEY } = process.env
const fcm = new FCM(APP_FCM_SERVERKEY)

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
      const userValue = await user.findByPk(recipient)
      console.log('user token', userValue.device_token, APP_FCM_SERVERKEY)
      const message = {
        to: userValue.device_token,
        notification: {
          title: userValue.user_name ? userValue.user_name : userValue.telphone,
          body: messages
        },
        data: {
          my_key: 'my value',
          my_another_key: 'my another value'
        }
      }
      fcm.send(message, function (err, response) {
        if (err) {
          console.log('Something has gone wrong!', err)
        } else {
          console.log('Successfully sent with response: ', response)
        }
      })
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
    console.log('RESULT', results)
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
