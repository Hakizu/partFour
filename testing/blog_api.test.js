const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./blog_api_helper')
const api = supertest(app)

const Blog = require('../Model/blogSchema')

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.intialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => 
        blog.save())
    await Promise.all(promiseArray)
})


describe('getting Data - Format and Length', () => {

    test('blog Data is returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
  
        const response = await helper.blogsInDB()
        expect(response).toHaveLength(
            helper.intialBlogs.length
        )
    })
})


test('ID property exists', async () => {
    const response = await helper.blogsInDB()

    const contents = response.map(g => g.id)
    expect(contents).toBeDefined()
})

test('Creating succeeds with valid data', async () => {
    const newBlog = {
        title: 'Blog list',
        author: 'Hakizu'
    }
    
    await api  
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogAtEnd = await helper.blogsInDB()
    expect(blogAtEnd).toHaveLength(helper.intialBlogs.length + 1)

    const contents = blogAtEnd.map(r => r.title)
    expect(contents).toContain(
        'Blog list'
    )
})

test('Setting likes to 0', async () => {
    const newBlog = {
        title: 'likes Test',
        author: 'Hakizu'
    }
    await api  
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const blogs = await helper.blogsInDB()
    const contents = blogs.map(r => r.likes)
    expect(contents).toContain(0)
})

afterAll(() => {
    mongoose.connection.close()
})