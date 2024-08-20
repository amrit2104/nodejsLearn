const DataLoader = require('dataloader');
const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');

// DataLoader instances
const eventLoader = new DataLoader(eventIds => {
    return events(eventIds);
});

const userLoader = new DataLoader(userIds => {
    return User.find({_id: {$in: userIds}});
});

const transformEvent = event => {
    return {
        ...event._doc,
        _id: event.id,
        // date : new Date(event._doc.date).toISOString(),
        date: dateToString(event._doc.date),
        creator: userLoader.load(event.creator.toString())
    };
}

const transformBooking = booking => {
    return {
        ...booking._doc,
        _id: booking.id,
        user: userLoader.load(booking._doc.user.toString()),
        event: eventLoader.load(booking._doc.event.toString()),
        createdAt: dateToString(booking._doc.createdAt),
        // createdAt: new Date(booking._doc.createdAt).toISOString(),
        // updatedAt: new Date(booking._doc.createdAt).toISOString()
        updatedAt: dateToString(booking._doc.updatedAt)
    };
}

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        // return { 
                //     ...event._doc, 
                //     _id: event.id,
                //     date : new Date(event._doc.date).toISOString(),
                //     creator: user.bind(this, event.creator) 
                // };
        return events.map(event => 
            transformEvent(event)
        );
    } catch (err) {
        throw err;
    }
};

const singleEvent = async eventId => {
    try {
        const event = await eventLoader.load(eventId.toString());
            // return {
            //   ...event._doc,
            //   _id: event.id,
            //   creator: user.bind(this, event.creator)
            // };
        return event;
    } catch (err) {
        throw err;
    }
};

const user = async userId => {
    try {
        const user = await userLoader.load(userId.toString());
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: () => eventLoader.loadMany(user._doc.createdEvents.map(event => event.toString()))
        };
        // graphql can return value as integer/string or even the result of a function as a value
    } catch (err) {
        throw err;
    }
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
// exports.user = user;
// exports.events = events;
// exports.singleEvent = singleEvent;