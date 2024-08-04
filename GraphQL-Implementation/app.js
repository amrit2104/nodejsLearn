const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql'); //It's a middleware function
const { buildSchema } = require('graphql'); //this will generate a graphql schema object


const app = express();

app.use(bodyParser.json());

// get request is getting routed to Hello World!
// app.get('/', (req,res,next) => {
//     res.send('Hello World!');
// })

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
    schema: buildSchema(`
        type RootQuery { 
            events: [String!]!
        }

        type RootMutation {
            createEvent(name: String): String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    // the below rootValue thing is a resolver
    rootValue: {
        events: () => {
            return ['Romantic Cooking', 'Sailing', 'All-Night Coding']
        },
        createEvent: (args) => {
            const eventName = args.name;
            return eventName;
        }
    },
    // the below statement will redirect to an URL where you gonna get nice user interface
    graphiql: true
}));

app.listen(3030);