import joi from 'joi'


export default {
  body: {
    impression_target: joi.number().required(),
  },
  headers: {
    'content-type': joi.string().valid('application/json').required(),
  },
  options: {
    allowUnknownBody: false,
  },
}
