const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('blog Data is returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(1)
})


afterAll(() => {
    mongoose.connection.close()
})