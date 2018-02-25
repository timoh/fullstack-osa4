const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const assert = require('assert')

const User = require('../models/user')
const loginRouter = require('express').Router()


loginRouter.post('/', async (req, res) => {
  const b = req.body
  const user = await User.findOne({ username: b.username })

  try {

    const compResult = await bcrypt.compare(b.password, user.password)
    const isPassCorrect = user === null ? false : compResult

    if (!(user && isPassCorrect)) {
      return res.status(401).send({ error: 'Error! Password or username is incorrect.' })
    }
    
    const matchingUser = {
      username: user.username,
      id: user._id
    }
    
    const token = jwt.sign(matchingUser, process.env.SECRET)
    res.status(200).send({ token, username: user.username, name: user.name })
    

  } catch (exception) {

    console.log("Error!")
    console.log(exception)
    return res.status(500).send({ error: 'Checking password failed..' })

  }
})

module.exports = loginRouter