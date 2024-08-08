const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql'); //It's a middleware function
const { buildSchema } = require('graphql'); //this will generate a graphql schema object

// we are going to pass the mongodb creds as env variables in nodemon.js and import mongoose here.
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user');
const app = express();

// const events = [];

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
    // ! means arrays non-nullable
    // here Event is a type or you can think of a class like TreeNode*
    // you don't need comma(',') is graphql, you can simply start a new line
    
    schema: buildSchema(`
        type Event {
            _id: ID! 
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type User {
            _id: ID! 
            email: String!
            password: String
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        input UserInput {
            email: String!
            password: String!
        }

        type RootQuery { 
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    // the below rootValue thing is a resolver
    rootValue: {
        events: () => {
            // return ['Romantic Cooking', 'Sailing', 'All-Night Coding']
            // return events;
            return Event.find()
            .then(events => {
                return events.map(event => {
                    // return { ...event._doc, _id: event._doc._id.toString() }; // for the case where id is not-readable
                    return { ...event._doc };
                });
            })
            .catch(err => {
                throw err;
            });
        },
        createEvent: (args) => {
            // const event = {
            //     _id: Math.random().toString(),
            //     title: args.eventInput.title, //it will now directly fetch from the arguments passed.
            //     description: args.eventInput.description, //we are eventInput because that is where we are passing the argument.
            //     price: +args.eventInput.price, // + converts the string to a number.
            //     date: args.eventInput.date
            // }
            const event = new Event({
                title: args.eventInput.title, //it will now directly fetch from the arguments passed.
                description: args.eventInput.description, //we are eventInput because that is where we are passing the argument.
                price: +args.eventInput.price, // + converts the string to a number.
                date: new Date(args.eventInput.date),
                creator: '66b4e6e5b7c3e004a5b7133a'
            })
            // events.push(event);
            // const eventName = args.name;
            let createdEvent;
            return event
                .save()
                .then(result => {
                    createdEvent = {...result._doc};
                    return User.findById('66b4e6e5b7c3e004a5b7133a')
                    // console.log(result);
                    // return {...result._doc}; 
                    //returns all the core properties that make up out document.
                })
                .then(user =>{
                    if(!user) {
                        throw new Error('User not found.')
                    }
                    //.push() is a method provided by mongoose
                    user.createdEvents.push(event);
                    return user.save();
                })
                .then(result => {
                    return createdEvent;
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
            
        },
        createUser: args => {

            // filter to check that there should not be more than one user.
            // In mongoose, we always go to the then block unless there is any connection error or something
            return User.findOne({email: args.userInput.email})
            .then(user => {
                if(user) {
                    throw new Error('User exists already.')
                }
                return bcrypt.hash(args.userInput.password, 12)
            })
            // here 12 is the no. of assault rounds which defines the security of the generated hash
            // Since generating the below password is an asynchronous task and we are in a resolver, we want graphql or express graphql to wait for us so I will return this so that Express graphql knows that we have an asynchronous operation and it should go to that promise chain and wait for it to be resolved.
            .then(hashedPassword => {
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword
                })
                return user.save();
            })
            .then(result => {
                return { ...result._doc,password:null };
            })
            .catch(err => {
                throw err;
            });
            
        }
    },
    // the below statement will redirect to an URL where you gonna get nice user interface
    graphiql: true
}));

    mongoose
    .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
        process.env.MONGO_PASSWORD
    }@cluster0.yzowgze.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=Cluster0`
    ).then(() => {
        app.listen(3030);
    })
    .catch( err => {
        console.log(err);
    });