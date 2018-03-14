/**
 * @fileOverview The GQL Schema resolvers.
 */
const log = require('logg').getLogger('app.gql.schema');

const booksData = require('./stub-data');

const resolvers = module.exports = {};

// The resolvers
resolvers.resolvers = {
  Query: { books: () => booksData },
  Mutation: {
    createBook: (_, { title, author, price }) => {
      log.info(`mutation createBook Title: ${title} Author: ${author}` +
        `Price: ${price}`);

      const record = {
        title,
        author,
        price,
      };

      booksData.push(record);

      return record;
    },
  },
};
