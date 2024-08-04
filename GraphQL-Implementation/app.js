const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql'); // we can build our schema as a string.

const app = express(); //express app-object

app.use(bodyParser.json());

//localhost:3030 will print Hello World!
// app.get('/', (req,res,next) => {
//     res.send('Hello World!');
// })

app.use('/graphql', graphqlHttp({
    // backticks(``) this allows you to write multiline string in javascript.
    schema: buildSchema(`
        type RootQuery { 

        }

        type RootMutation { 

        }

        schema {
            query:
            mutation: 
        }
    `),
    rootValue: {}
}));

app.listen(3030);