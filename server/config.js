import validate from 'express-validation'
import schema from './schema'


validate.options({ contextRequest: true })


export const headers = (req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range')
  return next()
}


export const handleError = (err, req, res, next) => {
  if (err instanceof validate.ValidationError) {
    return process.env.NODE_ENV === 'production' ?
      schema(res, 400, 'Unsupported body.') :
      res.status(err.status).send(err)
  }
  console.error(err.stack)
  return process.env.NODE_ENV === 'production' ?
    schema(res, 500, 'Internal server error.') :
    res.status(500).send(err.stack)
}
