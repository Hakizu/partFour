const blogRouter = require('express').Router()
const Blog = require('../Model/blogSchema')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
      response.json(blogs.map(blog => 
        blog.toJSON()))
})

blogRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogRouter.get('/:id', (request, response) => {
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

blogRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)

  blog.save()
    .then(result => {
      response.status(201).json(result)
    })
})

module.exports = blogRouter