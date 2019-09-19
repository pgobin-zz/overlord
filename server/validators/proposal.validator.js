import joi from 'joi'


export default {
  body: {
    txn_id: joi.string().guid().required(),
  },
  headers: {
    'content-type': joi.string().valid('application/json').required(),
  },
  options: {
    allowUnknownBody: false,
  },
}
