/**
 *
 *
 * 'transaction' table schema
 *
 *
 *
 *
 * @column id     Primary key
 */
export default {
  fields: {

    //

    id:                     { type: 'uuid', default: { '$db_function': 'uuid()' } },

    impression_target:      { type: 'int', default: 0 },
    is_proposal_count_met:  { type: 'boolean', default: false },
    max_proposal_count:     { type: 'int', default: 0 },
  },

  key: ['id'],

  options: {
    timestamps: { createdAt: 'added_time', updatedAt: 'updated_time' },
  },
}
