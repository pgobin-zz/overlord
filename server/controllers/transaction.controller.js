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
  let txnQuery
  const cpc = getCPC(req.body.impression_target)
  res.locals.txnId = db.uuid()

  try {
    const txn = new db.instance.transaction({
      id:                   res.locals.txnId,
      impression_target:    req.body.impression_target,
      max_proposal_count:   cpc,
    })
    txnQuery = txn.save({ return_query: true })
  } catch (error) {
    return schema(res, 500, 'Error during query creation.')
  }

  try {
    await db.doBatchAsync([txnQuery])
    await db.instance.proposal_count.updateAsync(
      { txn_id:             res.locals.txnId },
      { proposal_count:     db.datatypes.Long.fromInt(0) },
    )
  } catch (error) {
    return schema(res, 500, 'Error creating transaction.')
  }

  return schema(res, 200, 'Successfully created transaction.')
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
    txn = await db.instance.transaction.findOneAsync({
      id: db.uuidFromString(req.params.id),
    })
  } catch (error) {
    return schema(res, 500, 'Error querying transaction.')
  }

  if (txn) return schema(res, 200, txn)
  return schema(res, 404, 'Transaction not found.')
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
const update = async (req, res, next) => {
  let current
  const impressionTarget = req.body.impression_target
  const cpc = getCPC(impressionTarget)

  try {
    current = await db.instance.proposal_count.findOneAsync({
      txn_id: db.uuidFromString(req.params.id),
    })
  } catch (error) {
    return schema(res, 500, 'Error getting transaction status.')
  }

  try {
    await db.instance.transaction.updateAsync(
      { id:                    db.uuidFromString(req.params.id) },
      { impression_target:     req.body.impression_target,
        is_proposal_count_met: current.proposal_count >= cpc,
        max_proposal_count:    cpc,
      },
    )
  } catch (error) {
    return schema(res, 500, 'Error updating transaction.')
  }

  return schema(res, 200, 'Successfully updated transaction.')
}


/**
 *
 *
 *
 *
 * @param {Number} impressionTarget Desired impressions for a given transaction
 * @returns {Number} Calculated publisher count (CPC)
 */
const getCPC = (impressionTarget) =>
  Math.floor(
    4 + ((30 * (impressionTarget ** 2)) / (4e10 + (impressionTarget ** 2)))
  )


export default {
  create,
  get,
  update,
}
