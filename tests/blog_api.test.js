const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)

describe('GET /api/blogs', () => {

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

})

describe('POST /api/blogs', () => {

  test('POSTing a new blog posts results in more posts', async () => {
    const newPost = {
      "author": "Dean",
      "title": "Much More interesting topic",
      "url": "/api/blogs",
      "likes": 5
    }

    const responseOne = await api
      .post('/api/blogs')
      .send(newPost)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const newId = responseOne.body._id

    await api.delete(`/api/blogs/${newId}`)

    const responseTwo = await api
    .get('/api/blogs')

    expect(responseTwo.body.length).toBe(3)
  })

})



afterAll(() => {
  server.close()
})