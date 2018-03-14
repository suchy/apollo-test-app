/**
 * @fileOverview The GQL Schema resolvers.
 */
const log = require('logg').getLogger('app.gql.schema');

const booksData = require('./stub-data');

const resolvers = module.exports = {};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  // The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min)) + min;
}

// The resolvers
resolvers.resolvers = {
  Query: { books: () => booksData },
  Mutation: {
    createBook: (_, { title, author, price }) => {
      log.info(`mutation createBook Title: ${title} Author: ${author}` +
        `Price: ${price}`);

      const bookId = getRandomInt(50, 1000);

      const record = {
        bookId,
        title,
        author,
        price,
      };

      booksData.push(record);

      return record;
    },
  },
};
