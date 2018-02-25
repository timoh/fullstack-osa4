const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)

describe('GET /api/users', () => {

  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are three users', async () => {
    const response = await api
      .get('/api/users')

    expect(response.body.length).toBe(3)
  })

  test('the first user is Jose', async () => {
    const response = await api
      .get('/api/users')

    expect(response.body[0].name).toEqual('Jose')
  })

})

describe('POST /api/users', () => {

  test('POSTing a new blog posts results in more posts', async () => {

    /* 

      Get list of blog posts before creating a new post.
    
    */

    const usersBeforePost = await api
    .get('/api/users')

    const newUser = {
      "username": "jose",
      "password": "mikkomikko123",
      "name": "Jose",
      "adult": true
    }

    const responseOne = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    /*
    
      Then get the list again..
    
    */

    const usersAfterPost = await api
    .get('/api/users')

    /*
    
      Ensure that the length of the list has grown by one
    
    */

    const newId = responseOne.body._id
    expect(usersAfterPost.body.length).toBe(usersBeforePost.body.length + 1)

    /*
    
      Finally, delete the post and ensure the state is returned back to how it was.
    
    */

    await api.delete(`/api/users/${newId}`)

    const responseTwo = await api
    .get('/api/users')

    expect(responseTwo.body.length).toBe(usersBeforePost.body.length)
  })

})

describe('DELETE /api/users/:id', () => {

  test('deleting a record removes it from the list of users', async () => {

    /* 
    
      First create a new post, and then get the resulting list of blog posts
    
    */

    const newUser = {
      "username": "jose",
      "password": "mikkomikko123",
      "name": "Jose",
      "adult": true
    }

    const postResponse = await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const allUsersBeforeDelete = await api
    .get('/api/users')
    .expect(200)

    /*
    
      Match the created blog's ID with the list of all posts fetched through the API and ensure one post is found
    
    */

    expect(typeof postResponse.body._id).toBe('string')

    const matchingUser = allUsersBeforeDelete.body.filter(user => user.id == postResponse.body._id)
    expect(matchingUser.length).toEqual(1)

    expect(typeof matchingUser[0].id).toBe('string')

    /*
    
      Then delete the Blog post

    */

    const deleteResponse = await api
    .delete(`/api/users/${matchingUser[0].id}`)
    .expect(201)

    const allUsersAfterDelete = await api
    .get('/api/users')
    .expect(200)

    /*
    
      Search for Blogs with the ID and ensure none are found.
    
    */

    const matchingAfterDelete = allUsersAfterDelete.body.filter(user => user.id == postResponse.body._id)
    expect(matchingAfterDelete).toEqual([])

  })

})



afterAll(() => {
  server.close()
})