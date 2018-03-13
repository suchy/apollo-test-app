const { makeExecutableSchema } = require('graphql-tools');

const rootSchemaDef = require('./root-schema.graphql');

const schema = module.exports = {};

schema.executableSchema = makeExecutableSchema({
  typeDefs: [rootSchemaDef],
});

