const route = require('express').Router()
const {createChat, getDetailChat} = require('../controllers/chat')

route.post('/', createChat)
route.get('/', getDetailChat)

module.exports = route
