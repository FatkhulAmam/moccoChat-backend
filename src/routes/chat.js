const route = require('express').Router()
const {createChat, getAllUserChat, getChatDetail, deleteMessage} = require('../controllers/chat')

route.post('/', createChat)
route.get('/', getAllUserChat)
route.get('/detail/:recipients', getChatDetail)
route.delete('/:id', deleteMessage)

module.exports = route
