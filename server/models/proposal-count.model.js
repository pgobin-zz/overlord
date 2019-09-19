/**
 *
 *
 * 'proposal_count' table schema
 *
 *
 *
 *
 * @column txn_id Primary key
 */
export default {
  fields: {

    // Required to be separate because C* doesn't allow counter
    // types to exist beside columns of different types that aren't
    // the primary key

    txn_id:             'uuid',

    proposal_count:     'counter',
  },

  key: ['txn_id'],
}
