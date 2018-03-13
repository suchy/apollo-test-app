const { makeExecutableSchema } = require('graphql-tools');

const rootSchemaDef = require('./rootSchema.graphql');

const schema = module.exports = {};

schema.executableSchema = makeExecutableSchema({
  typeDefs: [rootSchemaDef],
});

