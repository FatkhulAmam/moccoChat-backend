const route = require('express').Router()
const { registrasiUser } = require('../controllers/auth')

route.post('/', registrasiUser)

module.exports = route
