// this is a middleware which is going to check if we have a valid token or not.

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    //checks if there is an authorisation request in the incoming request.
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1]; // get request output -> <user><space><token> and we want token and we are using space to separate user and tokens.
    if (!token || token === '') {
        req.isAuth = false;
        return next();
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'somesupersecretkey');
    } catch (err) {
        req.isAuth = false;
        return next();
    }
    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
};