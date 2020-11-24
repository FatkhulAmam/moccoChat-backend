const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const {APP_PORT} = process.env

app.use(bodyParser.urlencoded({extended: false}))
app.use(morgan('dev'))
app.use(cors())

//import middleware
const authMiddleware = require('./middlewares/auth')

// import routes
const authRoute = require('./routes/auth')
const userRoute = require('./routes/users')
const userChat = require('./routes/chat')

app.use('/auth', authRoute)
app.use('/user', authMiddleware, userRoute)
app.use('/chat', authMiddleware, userChat)

app.get('/', (req, res) => {
    res.send({
        success: true,
        message: `mocco chat app backend running well on port ${APP_PORT}`
    })
})

// provide static file(images)
app.use('/uploads', express.static('assets/uploads'))

app.listen(APP_PORT, ()=>{
    console.log(`Mocco Chat App Backend Running on port ${APP_PORT}`)
})