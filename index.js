const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const middleware = require('./utils/middleware')
const config = require('./utils/config')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')


app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))
app.use(middleware.logger)


app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

mongoose.connect(config.mongoUrl).then(() => {
  console.log('connected to database', config.mongoUrl)
})
  .catch(err => {
    console.log(err)
  })

mongoose.Promise = global.Promise

app.use(middleware.error)
app.use(middleware.getToken)

const PORT = config.port

const server = http.createServer(app)

if(!module.parent){ 
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}



server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}