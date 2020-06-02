const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./util/config')
const Blog = require('./Model/blogSchema')

mongoose.connect(config.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
console.log(`connecting to ${config.mongoUrl}`)

app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
    response.send('<h4>Welcome!</h4>')
})

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.get('/api/blogs/:id', (request, response) => {
    Blog.findById(request.params.id)
        .then(blog => {
            if (blog) {
                response.json(blog)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => console.log(error))
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog.save()
    .then(result => {
      response.status(201).json(result)
    })
})

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})