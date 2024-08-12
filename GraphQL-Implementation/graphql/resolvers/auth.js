const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
    },
    login: async ({email, password}) => {
        const user = await User.findOne({email: email});

        if(!user){
            throw new Error('User does not exist!');
        }
        // here password is the provided password and user.password is the incoming password from the database.
        const isEqual = await bcrypt.compare(password, user.password);

        if(!isEqual)
        {
            throw new Error('Password is incorrect!');
        }

        //synchronous task
        const token = jwt.sign({userId: user.id, email: user.email}, 'somesupersecretkey', {
            expiresIn: '1h' // this means the token will expire in one hour
        });
        // 'somesupersecretkey' : the second argument above is a string which is used to hash the token and this will be later required for validating it because this basically is your private key only someone who knows that key can validate this token and therefore it should be on your server and not exposed to your clients.

        return { userId: user.id, token: token, tokenExpiration : 1 }
    }
};