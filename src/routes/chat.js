const route = require('express').Router()
const {createChat, getListChat, getChatDetail, deleteMessage} = require('../controllers/chat')

route.post('/', createChat)
route.get('/', getListChat)
route.get('/detail/:recipients', getChatDetail)
route.delete('/:id', deleteMessage)

module.exports = route
