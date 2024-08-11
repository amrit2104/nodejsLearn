const Event = require('../../models/event');
const User = require('../../models/user');
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

const transformBooking = booking => {
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

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
// exports.user = user;
// exports.events = events;
// exports.singleEvent = singleEvent;