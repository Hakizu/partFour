const Blog = require('../Model/blogSchema')
const User = require('../Model/User')

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const intialBlogs = [
    {
      title: 'HTML is easy',
      author: 'hakizu',
      url: 'www.hakizu.net',
      likes: 4,
    },
    {
      title: 'Browser can execute only Javascript',
      author: 'fullstack',
      url: 'fullstackopen.com',
      likes: 999,
    }
]

const blogsInDB = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    intialBlogs, blogsInDB, usersInDb
}