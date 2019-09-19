import db from '../db'
import schema from '../schema'


/**
 *
 *
 *
 *
 * @param {Object} req   Represents a given HTTP request
 * @param {Object} res   Represents a given HTTP response
 * @param {Object} next  The next middleware function
 */
const create = async (req, res, next) => {
  const query = []
  let txn, cnt

  try {
    txn = await db.instance.transaction.findOneAsync({
      id: db.uuidFromString(req.body.txn_id),
    })
    cnt = await db.instance.proposal_count.findOneAsync({
      txn_id: db.uuidFromString(req.body.txn_id),
    })
    if (cnt.proposal_count >= txn.max_proposal_count)
      return schema(res, 400, 'Proposal maximum already reached.')
  } catch (error) {
    return schema(res, 500, 'Error getting transaction status.')
  }

  res.locals.proposalId = db.uuid()

  try {
    const proposal = new db.instance.proposal({
      id:                   res.locals.proposalId,
      txn_id:               db.uuidFromString(req.body.txn_id),
    })
    query.push(proposal.save({ return_query: true }))

    if (parseInt(cnt.proposal_count) + 1 >= txn.max_proposal_count) {
      const txnQuery = db.instance.transaction.update(
        { id:                 db.uuidFromString(req.body.txn_id) },
        { is_proposal_count_met: true },
        { return_query: true }
      )
      query.push(txnQuery)
    }

    await db.instance.proposal_count.updateAsync(
      { txn_id:             db.uuidFromString(req.body.txn_id) },
      { proposal_count:     db.datatypes.Long.fromInt(1) },
    )

  } catch (error) {
    return schema(res, 500, 'Error during query creation.')
  }

  try {
    await db.doBatchAsync(query)
  } catch (error) {
    return schema(res, 500, 'Error creating transaction.')
  }

  return schema(res, 200, 'Successfully created proposal.')
}


/**
 *
 *
 *
 *
 * @param {Object} req   Represents a given HTTP request
 * @param {Object} res   Represents a given HTTP response
 * @param {Object} next  The next middleware function
 */
const get = async (req, res, next) => {
  let txn
  try {
    txn = await db.instance.proposal.findOneAsync({
      id: db.uuidFromString(req.params.id),
    })
  } catch (error) {
    return schema(res, 500, 'Error querying proposal.')
  }

  if (txn) return schema(res, 200, txn)
  return schema(res, 404, 'Proposal not found.')
}


export default {
  create,
  get,
}
