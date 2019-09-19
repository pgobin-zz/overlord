import express from 'express'
import router from './router'
import schema from './schema'
import { handleError, headers } from './config'


const app = express()
app.set('json spaces', 2)
app.disable('x-powered-by')


app.use(headers)
app.use(express.json())
app.use('/v1.0', router)
app.use(handleError)


app.all('*', (req, res) => schema(res, 400, 'Unsupported request'))
app.listen(process.env.PORT)
