import ExpressCassandra from 'express-cassandra'
import * as models from './models'


const db = ExpressCassandra.createClient({
  clientOptions: {
    contactPoints:          [process.env.CASSANDRA_CONTACT_POINTS],
    protocolOptions:        { port: process.env.CASSANDRA_PORT },
    keyspace:               process.env.CASSANDRA_KEYSPACE,
  },
  ormOptions: {
    defaultReplicationStrategy: {
      class:                'SimpleStrategy',
      replication_factor:   1,
    },
    migration:              process.env.CASSANDRA_SCHEMA_MIGRATION,
  },
})


const out = (name, error, result) => {
  if (result)
    console.info(`\x1b[33mMigration: '${name}' schema updated.`)
  if (!error) return

  switch (error.name) {

    // Failed to read table schema. If this happens, there's
    // probably a connection issue with Cassandra. Check that
    // it's actually running.

    case 'apollo.model.tablecreation.dbschemaquery':
      console.error(name, `\n\x1b[47m\x1b[30m${error.message}\x1b[0m`)
      console.info('\n\x1b[32mIs C* running?\x1b[0m\n')
      process.exit(1)
      break
    default:
      console.error(name, error)
      break
  }
}


db.loadSchema('proposal', models.Proposal).syncDB(out.bind(this, 'proposal'))
db.loadSchema('transaction', models.Transaction).syncDB(out.bind(this, 'transaction'))
db.loadSchema('proposal_count', models.ProposalCount).syncDB(out.bind(this, 'proposal_count'))


export default db
