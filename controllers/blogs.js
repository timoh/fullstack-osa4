const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const delTools = require('../utils/deleteBlogs')

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