const blogRouter = require('express').Router()
const Blog = require('../Model/blogSchema')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(blog => blog.toJSON()))
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogRouter.post('/', async (request, response) => {
  const body = new Blog(request.body)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ?
      0 : body.likes
  })

  const savedBlog = await blog.save()
  response.json(savedBlog.toJSON())
})

module.exports = blogRouter