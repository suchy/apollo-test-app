import { makeExecutableSchema } from 'graphql-tools';

import rootSchemaDef from './rootSchema.graphql';

const executableSchema = makeExecutableSchema({
  typeDefs: [rootSchemaDef],
});

export default executableSchema;
