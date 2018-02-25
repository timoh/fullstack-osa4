const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs')
  response.json(users.map(User.format))
})

/*
 
Format of a user:

{
  username: String,
  password: String,
  name: String,
  adult: Boolean
}

*/

userRouter.post('/', async (request, response) => {
  try {

    /*
    
      When testing, reduce salt rounds to speed up test suite
    
    */

    let saltRounds = 10
    if (process.env.NODE_ENV == 'test') {
      saltRounds = 2
    }

    const saltedPassword = await bcrypt.hash(request.body.password, saltRounds)

    const incomingUser = {
      username: request.body.username,
      name: request.body.name,
      adult: request.body.adult,
      password: saltedPassword
    }

    const user = new User(incomingUser)
    const result = await user.save()
    response.status(201).json(result)

  } catch (exception) {

    console.log(exception)
    response.status(500).json({ error: 'error in creating new user!' })

  }
})

userRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  await User.findByIdAndRemove(id)
  response.status(201).json(id)
})

module.exports = userRouter