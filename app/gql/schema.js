/**
 * @fileOverview The GQL Schema.
 */
const { makeExecutableSchema } = require('graphql-tools');

const { resolvers } = require('./resolvers');

const schema = module.exports = {};

schema.typeDefs = `
  type Book {
    bookId: Int!,
    title: String!,
    author: String!,
    price: Float!
  }

  input BookInput {
    title: String!,
    author: String!,
    price: Float!
  }

  type Query {
    books: [Book]
    book(bookId:Int!): Book
  }

  type Mutation {
    createBook (
      title: String!,
      author: String!,
      price: Float!
    ): Book

    editBook (
      bookId: Int!,
      title: String!,
      author: String!,
      price: Float!
    ): Book
  }

`;

schema.schema = makeExecutableSchema({
  typeDefs: schema.typeDefs,
  resolvers,
});
