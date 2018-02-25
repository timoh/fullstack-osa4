const assert = require('assert')
const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')
const delTools = require('../utils/deleteBlogs')

const middleware = require('../utils/middleware')

blogRouter.use(middleware.getToken)

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { id: 1, username: 1, name: 1, adult: 1 })
  response.json(blogs.map(Blog.format))
})

/*
 
Format of a post:

{
  "author": "James",
  "title": "Interesting topic",
  "url": "/api/blogs",
  "likes": 0
}

*/



blogRouter.post('/', async (request, response) => {
  const b = request.body

  try {

    // console.log("Token:", request.token)
    // assert.equal(typeof request.token, 'string')

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    // console.log("dec token:", decodedToken)

    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'Problem with token - missing / invalid!' })
    }

    if (b === undefined) {
      return response.status(400).json({ error: 'Request body is missing!' })
    }

    const getUser = await User.findById(decodedToken.id)

    const adderUserId = getUser._id

    const newPost = {
      title: b.title,
      author: b.author,
      url: b.url,
      likes: b.likes,
      user: adderUserId
    }

    const blog = new Blog(newPost)
    const result = await blog.save()

    getUser.blogs.push(result)
    await getUser.save()

    response.status(201).json(result)

  } catch (exception) {

    if (exception.name === 'JsonWebTokenError' ) {
      const jwtMessage = exception.message
      const statusMessage = `There was a problem with the JSON web token: ${jwtMessage}`

      response.status(401).json({ error: statusMessage })

    } else {

      console.log(exception)
      response.status(500).json({ error: 'Server error!' })

    }

  }

  /**
   * 
   *  Ensure that there is a user associate
   *  with the post being created
   * 
   */

  
})

blogRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  await Blog.findByIdAndRemove(id)
  response.status(201).json(id)
})

blogRouter.get('/delall', async (req, res) => {
  const del = await delTools.deleteBlogs({"author" : "Mike Mike"})
  const get = await delTools.findBlogs({})
  res.status(201).json(get)
})

blogRouter.get('/findall', async (req, res) => {
  const result = await delTools.findBlogs({"author" : "Dean"})
  res.status(201).json(result)
})

module.exports = blogRouter