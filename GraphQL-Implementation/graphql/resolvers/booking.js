const Event = require('../../models/event');
const Booking = require('../../models/booking');
const { transformBooking, transformEvent } = require('./merge');

module.exports = {
    bookings: async (args,req) =>{
        if(!req.isAuth)
        {
            throw new Error('Unauthenticated');
        }
        try {
            const bookings = await Booking.find({user: req.userId});
            // find({user: req.userId}) is a filter here now, to filter by user id. So that the person who booked an event can now cancel the event.
            return bookings.map(booking => {
                // return { 
                //     ...booking._doc, 
                //     _id: booking.id, 
                //     user: user.bind(this,booking._doc.user),
                //     event: singleEvent.bind(this, booking._doc.event),
                //     createdAt: dateToString(booking._doc.createdAt),
                //     // createdAt: new Date(booking._doc.createdAt).toISOString(),
                //     // updatedAt: new Date(booking._doc.createdAt).toISOString()
                //     updatedAt: dateToString(booking._doc.createdAt)
                // }
                return transformBooking(booking);
            });
        }
        catch (err) {
            throw err;
        }
    },
    bookEvent: async (args,req) => {
        if(!req.isAuth)
        {
            throw new Error('Unauthenticated');
        }
        const fetchedEvent = await Event.findOne({ _id: args.eventId });
        const booking = new Booking({
            user: req.userId,
            event: fetchedEvent
        });
        const result = await booking.save();
        // return {
        //     ...result._doc,
        //     _id: result.id,
        //     user: user.bind(this,booking._doc.user),
        //     event: singleEvent.bind(this, booking._doc.event),
        //     createdAt: dateToString(result._doc.createdAt).toISOString(),
        //     updatedAt: dateToString(result._doc.createdAt).toISOString()
        // }
        return transformBooking(result);
    },
    cancelBooking: async (args,req) => {
        if(!req.isAuth)
        {
            throw new Error('Unauthenticated');
        }
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