/**
 * @fileOverview The GQL Schema resolvers.
 */
const log = require('logg').getLogger('app.gql.schema');
const { find } = require('lodash');

const booksData = require('./stub-data');

const resolvers = module.exports = {};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  // The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min)) + min;
}

function queryBook(root, args) {
  return find(booksData, { bookId: args.bookId });
}

resolvers.resolvers = {
  Query: {
    book: queryBook,
    books: () => booksData,
  },
  Mutation: {
    createBook: (_, { title, author, price }) => {
      log.info(`mutation createBook Title: ${title} Author: ${author} Price: ${price}`);

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
    editBook: (_, {
      bookId,
      title,
      author,
      price,
    }) => {
      log.info(`mutation editBook bookId: ${bookId} Title: ${title} Author: ${author} Price: ${price}`);

      const bookRecord = find(booksData, { bookId });

      if (!bookRecord) {
        throw new Error('Book ID defined did not match a record');
      }

      bookRecord.title = title;
      bookRecord.author = author;
      bookRecord.price = price;

      return bookRecord;
    },
  },
};
