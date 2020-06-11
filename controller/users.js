const userRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../Model/User')

userRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users.map(val => val.toJSON()))
})

userRouter.post('/', async (request, response) => {
    const body = request.body

    if (!body.password || !body.username) {
        return response.status(400).json({
            error: 'Username or password missing'
        })
    }

    if (body.password.length < 3 ||
        body.username.length < 3) {
        return response.status(400).json({
            error: 'Username or password too short - min: 3 characters each'
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash
    })

    const savedUser = await user.save()

    response.json(savedUser)
})

module.exports = userRouter