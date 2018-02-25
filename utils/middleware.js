const logger = (request, response, next) => {
  if ( process.env.NODE_ENV === 'test' ) {
    return next()
  }
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const error = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


const getToken = (req, res, next) => {
  const auth = req.get('Authorization')

  if (auth) {
    if (auth.toLowerCase().startsWith('bearer ')) {
      req.token = auth.substring(7)
      // console.log("Token is: ", req.token)
    } else {
      req.token = null
    }
    
  } else {
    req.token = null
  }

  next()
}

module.exports = {
  logger,
  error,
  getToken
}