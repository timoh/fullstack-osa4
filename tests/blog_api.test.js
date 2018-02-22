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

    expect(response.body[0].title).toEqual('Interesting topic')
  })

})

describe('POST /api/blogs', () => {

  test('POSTing a new blog posts results in more posts', async () => {

    /* 

      Get list of blog posts before creating a new post.
    
    */

    const blogsBeforePost = await api
    .get('/api/blogs')

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

    /*
    
      Then get the list again..
    
    */

    const blogsAfterPost = await api
    .get('/api/blogs')

    /*
    
      Ensure that the length of the list has grown by one
    
    */

    const newId = responseOne.body._id
    expect(blogsAfterPost.body.length).toBe(blogsBeforePost.body.length + 1)

    /*
    
      Finally, delete the post and ensure the state is returned back to how it was.
    
    */

    await api.delete(`/api/blogs/${newId}`)

    const responseTwo = await api
    .get('/api/blogs')

    expect(responseTwo.body.length).toBe(blogsBeforePost.body.length)
  })

})

describe('DELETE /api/blogs/:id', () => {

  test('deleting a record removes it from the list of blogs', async () => {

    /* 
    
      First create a new post, and then get the resulting list of blog posts
    
    */

    const newPost = {
      "author": "Mike Mike",
      "title": "Delete me!",
      "url": "/api/blogs",
      "likes": 0
    }

    const postResponse = await api
    .post('/api/blogs')
    .send(newPost)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const allBlogsBeforeDelete = await api
    .get('/api/blogs')
    .expect(200)

    /*
    
      Match the created blog's ID with the list of all posts fetched through the API and ensure one post is found
    
    */

    const matchingBlog = allBlogsBeforeDelete.body.filter(blog => blog._id == postResponse.body._id)
    expect(matchingBlog.length).toEqual(1)

    /*
    
      Then delete the Blog post

    */

    const deleteResponse = await api
    .delete(`/api/blogs/${matchingBlog[0]._id}`)
    .expect(201)

    const allBlogsAfterDelete = await api
    .get('/api/blogs')
    .expect(200)

    /*
    
      Search for Blogs with the ID and ensure none are found.
    
    */

    const matchingAfterDelete = allBlogsAfterDelete.body.filter(blog => blog._id == postResponse.body._id)
    expect(matchingAfterDelete).toEqual([])

  })

})



afterAll(() => {
  server.close()
})