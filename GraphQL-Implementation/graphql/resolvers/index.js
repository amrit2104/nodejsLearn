const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');
const { dateToString } = require('../../helpers/date');

const transformEvent = event => {
    return {
        ...event._doc, 
        _id: event.id,
        // date : new Date(event._doc.date).toISOString(),
        date : dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    };
}

const events = eventIds => {
    return Event.find({_id: {$in: eventIds}})
    .then(events => {
        return events.map(event => {
            if (event && event._doc) {
                // return { 
                //     ...event._doc, 
                //     _id: event.id,
                //     date : new Date(event._doc.date).toISOString(),
                //     creator: user.bind(this, event.creator) 
                // };
                return transformEvent(event);
            }
            else{
                throw new Error("Event not found or invalid data");
            }
        })
    })
    .catch( err => {
        throw err;
    })
};

const singleEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    // return {
    //   ...event._doc,
    //   _id: event.id,
    //   creator: user.bind(this, event.creator)
    // };
    return transformEvent(event);
    } 
    catch (err) {
        throw err;
    }
};

const user = userId => {
    return User.findById(userId)
    .then( user => {
        if (user && user._doc) {
        return { 
            ...user._doc, 
            _id: user.id,
            createdEvents: events.bind(this, user._doc.createdEvents) 
        };
        // graphql can return value as integer/string or even the result of a function as a value
        }
        else {
            throw new Error("User not found or invalid data");
        }
    })
    .catch( err => {
        throw err;
    })
};

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
    bookings: async () =>{
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return { 
                    ...booking._doc, 
                    _id: booking.id, 
                    user: user.bind(this,booking._doc.user),
                    event: singleEvent.bind(this, booking._doc.event),
                    createdAt: dateToString(booking._doc.createdAt),
                    // createdAt: new Date(booking._doc.createdAt).toISOString(),
                    // updatedAt: new Date(booking._doc.createdAt).toISOString()
                    updatedAt: dateToString(booking._doc.createdAt)
                }
            });
        }
        catch (err) {
            throw err;
        }
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
    },
    bookEvent: async args => {
        const fetchedEvent = await Event.findOne({ _id: args.eventId });
        const booking = new Booking({
            user: '66b54537c9d53a5f71d8ce22',
            event: fetchedEvent
        });
        const result = await booking.save();
        return {
            ...result._doc,
            _id: result.id,
            user: user.bind(this,booking._doc.user),
            event: singleEvent.bind(this, booking._doc.event),
            createdAt: dateToString(result._doc.createdAt).toISOString(),
            updatedAt: dateToString(result._doc.createdAt).toISOString()
        }
    },
    cancelBooking: async args => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            // const event = {
            //     ...booking.event._doc,
            //     _id: booking.event.id,
            //     creator: user.bind(this, booking.event._doc.creator)
            // };
            const event = transformEvent(booking.event);
            //we are using booking.event and not booking._doc.event because _doc contains just the data.
            await Booking.deleteOne({ _id: args.bookingId });
            return event;
        } catch (err) {
          throw err;
        }
      }
};