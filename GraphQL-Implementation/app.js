const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql'); //It's a middleware function
const isAuth = require('./middleware/is-auth');
// we are going to pass the mongodb creds as env variables in nodemon.js and import mongoose here.
const mongoose = require('mongoose');

const graphQLSchema = require('./graphql/schema/index')
const graphQLResolvers = require('./graphql/resolvers/index')

const app = express();



// const events = [];

app.use(bodyParser.json());

// get request is getting routed to Hello World!
// app.get('/', (req,res,next) => {
//     res.send('Hello World!');
// })

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //Every Host or every client can send request here.
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS'); // Access for all the types of methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
});

app.use(isAuth);

app.use(
    '/graphql', 
    graphqlHTTP({
    // backticks (``) help to write multiline string in javascript
    // we have query to fetch data
    // we have mutation to change data
    // graphql is a type language, it works with types; i.e. it knows which kind of data it expects
    // here RootQuery is an object where we are going to define real endpoints.
    // In graphql world, you always define list of something.
    // [String!]!: this wont return null or a list of null strings
    // ! means arrays non-nullable
    // here Event is a type or you can think of a class like TreeNode*
    // you don't need comma(',') is graphql, you can simply start a new line
    
    schema: graphQLSchema,
    // the below rootValue thing is a resolver
    rootValue: graphQLResolvers,
    // the below statement will redirect to an URL where you gonna get nice user interface
    graphiql: true
}));

    mongoose
    .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
        process.env.MONGO_PASSWORD
    }@cluster0.yzowgze.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=Cluster0`
    ).then(() => {
        app.listen(8000);
    })
    .catch( err => {
        console.log(err);
    });