const assert = require('assert')
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const delTools = require('../utils/deleteBlogs')

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

  /**
   * 
   *  Ensure that there is a user associate
   *  with the post being created
   * 
   */

  const getUser = await User.findOne()

  const adderUserId = getUser._id

  const b = request.body

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