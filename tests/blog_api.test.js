const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are three blogs', async () => {
    const response = await api
      .get('/api/blogs')
  
    expect(response.body.length).toBe(3)
  })
  
  test('the first blog is interesting', async () => {
    const response = await api
      .get('/api/blogs')
    
      // console.log("Response body:",response.body)

    expect(response.body[0].title).toBe('Interesting topic')
  })

afterAll(() => {
  server.close()
})