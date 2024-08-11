const Event = require('../../models/event');

const { transformEvent  } = require('./merge');

module.exports = {
    events: () => {
        // return ['Romantic Cooking', 'Sailing', 'All-Night Coding']
        // return events;
        return Event.find()
        // .populate('creator')
        //populate is a method provided by mongoose to populate any relations at nose. 
        //Here it will populate the creator field
        .then(events => {
            return events.map(event => {
                // return { ...event._doc, _id: event._doc._id.toString() }; // for the case where id is not-readable
                if (event && event._doc) {
                // return { 
                //     ...event._doc,
                //     _id: event.id,
                //     // creator: {
                //     //     ...event._doc.creator._doc,
                //     //     _id: event._doc.creator.id
                //     // }
                //     date : new Date(event._doc.date).toISOString(),
                //     creator: user.bind(this, event._doc.creator)
                //  };
                return transformEvent(event);
                }
                else {
                    throw new Error("Event not found or invalid data");    
                }
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
            date: dateToString(args.eventInput.date),
            creator: '66b54537c9d53a5f71d8ce22'// creating a static user
        })
        // events.push(event);
        // const eventName = args.name;
        let createdEvent;
        return event
            .save()
            .then(result => {
                // createdEvent = {
                //     ...result._doc, 
                //     date : new Date(event._doc.date).toISOString(),
                //     creator: user.bind(this, result._doc.creator)
                // };
                createdEvent = transformEvent(result);
                return User.findById('66b54537c9d53a5f71d8ce22') // static user
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
        
    }
      
};
  