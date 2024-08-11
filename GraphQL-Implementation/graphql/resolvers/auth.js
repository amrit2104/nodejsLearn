const bcrypt = require('bcryptjs');
const User = require('../../models/user');

module.exports = {
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
};