/*

  This is a util lib to be able to quickly find and delete Blog posts.

  The idea is that these can be then called from the router.

*/

const Blog = require('../models/blog')

const findBlogs = async (condition) => {
  const result = await Blog.find(condition)
  return result
}

const deleteBlogs = async (condition) => {
  const result = await Blog.remove(condition)
  return result
}

module.exports = {
  findBlogs,
  deleteBlogs
}