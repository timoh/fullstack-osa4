const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
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
  const blog = new Blog(request.body)

  const result = await blog.save()
  response.status(201).json(result)
})

module.exports = blogRouter