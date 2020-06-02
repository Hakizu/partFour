require('dotenv').config()

let PORT = process.env.PORT
const mongoUrl = process.env.mongoUrl

module.exports = {
    PORT,
    mongoUrl
}