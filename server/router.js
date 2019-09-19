import express from 'express'
import validate from 'express-validation'
import * as validators from './validators'
import {
  proposal,
  transaction,
} from './controllers'


const router = express.Router()


router.post('/transactions',    validate(validators.transaction), transaction.create)
router.post('/proposals',       validate(validators.proposal), proposal.create)

router.get('/transactions/:id', transaction.get)
router.get('/proposals/:id',    proposal.get)

router.put('/transactions/:id', validate(validators.transaction), transaction.update)


export default router
