const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./blog_api_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Blog = require('../Model/blogSchema')
const User = require('../Model/User')

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.intialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => 
        blog.save())
    await Promise.all(promiseArray)
})

describe('Handling invalid cases of user creation', () => {
    beforeEach(async () => {
        await User.deleteMany({})
    
        const passwordHash = await bcrypt.hash('topSecret', 10)
        const user = new User({ username: 'trial', passwordHash })

        await user.save()
    })

    test('Creating a new User', async () => {
        const usersAtBeginning = await helper.usersInDb()
    
        const newUser = {
            username: 'Hakizu',
            name: 'Akisu',
            password: 'duper'
        }
    
        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtBeginning.length + 1)
    
    })    

    test('Username is not unique', async () => {
        const usersAtBeginning = await helper.usersInDb()

        const newUser = {
            username: 'trial',
            name: 'blue',
            password: 'halas'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
            
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtBeginning.length)
    })

    test('password is too short', async () => {
        const usersAtBeginning = await helper.usersInDb()

        const newUser = {
            username: 'byCombat',
            name: 'blue',
            password: 'b'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtBeginning.length)
    })

    test('Username too short', async () => {
        const usersAtBeginning = await helper.usersInDb()

        const newUser = {
            username: 'ts',
            name: 'squeak',
            password: 'fish'
        }

        await api  
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtBeginning.length)
        expect(usersAtEnd).not.toContain(newUser)
    })

})

describe('Creating entries', () => {

    let token = null
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('tupper', 10)
        const user = new User ({ username: 'lion', passwordHash })
        const saveUser = await user.save()
        
        const userForToken = {
            username: user.username,
            id: user._id
        }
        token = jwt.sign(userForToken, process.env.EY)
    })
    

    test('Creating succeeds with valid data', async () => {
        const newBlog = {
            title: 'Blog list',
            author: 'Hakizu',
            url: 'trial.net'
        }
    
        await api  
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
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

describe('handle missing data', () => {
    test('Setting likes to 0', async () => {
        const newBlog = {
            title: 'likes Test',
            author: 'Hakizu',
            url: 'trial.net'
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

    test('url or title missing - bad request', async () => {
        const newBlog = {
            author: 'Hakizu'
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    
        const blogsAtEnd = await helper.blogsInDB()
        expect(blogsAtEnd).toHaveLength(helper.intialBlogs.length)
    })
})

describe('handle delete and update', () => {

    test('succeeds with a valid id', async () => {
        const blogAtStart = await helper.blogsInDB()
        const blogToView = blogAtStart[0]
    
        const resultBlog = await api
          .get(`/api/blogs/${blogToView.id}`)
          .expect(200)
          .expect('Content-Type', /application\/json/)
    
        expect(resultBlog.body).toEqual(blogToView)
      })


    test('delete a specific note', async () => {
        const blogAtStart = await helper.blogsInDB()
        const blogToDelete = blogAtStart[0]

        await api 
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)
        
        const blogsAtEnd = await helper.blogsInDB()

        expect(blogsAtEnd.length).toBe(
            helper.intialBlogs.length - 1
            )

        const contents = blogsAtEnd.map(r => r.title)

        expect(contents).not.toContain(blogToDelete.title)
    })

    test('update an item', async () => {
        const blogsAtStart = await helper.blogsInDB()
        const blogUpdated = blogsAtStart[0]

        blogUpdated.title = 'updated list'
        blogUpdated.author = 'Haki'
        blogUpdated.likes = 150

        await api
            .put(`/api/blogs/${blogUpdated.id}`)
            .send(blogUpdated)
            .expect(200)
        
        const blogsAtEnd = await helper.blogsInDB()
        const contents = blogsAtEnd.map(p => p.title)
        expect(contents).toContain('updated list')
    })
})

afterAll(() => {
    mongoose.connection.close()
})