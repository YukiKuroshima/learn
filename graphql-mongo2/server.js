const graphql = require('graphql').graphql;
const express = require('express');
const graphQLHTTP = require('express-graphql');
const Schema = require('./schema');

const query = 'query { todos { id, title, completed } }';
graphql(Schema, query).then((result) => {
  console.log(JSON.stringify(result, null, '  '));
});

const app = express();

app.use('/', graphQLHTTP({
  schema: Schema,
  pretty: true,
  graphiql: true,
}));

app.listen(8080, (err) => {
  console.log('GraphQL server is now running on port 8080');
});

