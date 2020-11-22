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
// const authMiddleware = require('./middlewares/auth')

// import routes
const userRoute = require('./routes/users')

app.use('/user', userRoute)

app.get('/', (req, res) => {
    res.send({
        success: true,
        message: `backend running well on port ${APP_PORT}`
    })
})

// provide static file(images)
app.use('/uploads', express.static('assets/uploads'))

app.listen(APP_PORT, ()=>{
    console.log(`Running on port ${APP_PORT}`)
})