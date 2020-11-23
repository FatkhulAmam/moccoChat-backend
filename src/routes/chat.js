const route = require('express').Router()
const {createMessage} = require('../controllers/chat')

route.post('/', createMessage)

module.exports = route
