// using the same MongoDB URI for all envs for now,
// but providing option for customize per env
let mongoUrl = process.env.MONGODB_URI_PROD

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
  mongoUrl = process.env.MONGODB_URI_PROD
} else {  
  mongoUrl = process.env.MONGODB_URI_PROD
}

let port = process.env.PORT

if (process.env.NODE_ENV === 'test') {
  port = process.env.TEST_PORT
  mongoUrl = process.env.MONGODB_URI_PROD
}

module.exports = {
  mongoUrl,
  port
}