const config = require('./util/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogRouter = require('./controller/blogRouter')
const userRouter = require('./controller/users')
const loginRouter = require('./controller/login')
const middleware = require('./util/middleware')
const logger = require('./util/logger')
const mongoose = require('mongoose')

logger.info('connecting to', config.mongoUrl)

mongoose.connect(config.mongoUrl, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    })
    .then(() => 
    console.log(`connected to MongoDB`))
    .catch((error) => {
        logger.error(` error connecting to MongoDB`, 
        error.message)
    })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app