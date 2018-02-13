const mongoose = require('mongoose')
require('dotenv').config()
let url = process.env.MONGODB_URI_PROD

// Not needed yet:

// if ( process.env.NODE_ENV !== 'production' ) {
//   url = process.env.MONGODB_URI_DEV
// } else {
//   url = process.env.MONGODB_URI_PROD
// }

const Blog = mongoose.model('Blog', {
  title: String,
  author: String,
  url: String,
  likes: Number
})

mongoose.connect(url)
mongoose.Promise = global.Promise

module.exports = Blog