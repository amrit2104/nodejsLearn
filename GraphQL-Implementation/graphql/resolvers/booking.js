const Event = require('../../models/event');
const Booking = require('../../models/booking');
const { transformBooking, transformEvent } = require('./merge');

module.exports = {
    bookings: async () =>{
        try {
            const bookings = await Booking.find();
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
    bookEvent: async args => {
        const fetchedEvent = await Event.findOne({ _id: args.eventId });
        const booking = new Booking({
            user: '66b54537c9d53a5f71d8ce22',
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