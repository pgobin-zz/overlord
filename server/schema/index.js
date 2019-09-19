import errorSchema from './error.schema'
import successSchema from './success.schema'


const schema = (res, type, props) => {
  switch (type) {
    case 200: return res.send(successSchema(props))
    default: return res.status(type).send(errorSchema(props))
  }
}


export default schema
