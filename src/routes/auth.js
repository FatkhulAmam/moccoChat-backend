const route = require('express').Router()
const {loginUser, registrasiUser} = require('../controllers/auth')

route.post('/login', loginUser)
route.post('/register', registrasiUser)

module.exports = route