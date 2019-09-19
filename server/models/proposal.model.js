/**
 *
 *
 * 'proposal' table schema
 *
 *
 *
 *
 * @column id     Primary key
 * @column txn_id Index
 */
export default {
  fields: {

    //

    id:                   { type: 'uuid', default: { '$db_function': 'uuid()' } },

    txn_id:               'uuid',
  },

  key: ['id'],
  indexes: ['txn_id'],

  options: {
    timestamps: { createdAt: 'added_time', updatedAt: 'updated_time' },
  },
}
