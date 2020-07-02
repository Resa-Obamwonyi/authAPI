const jwt = require('jsonwebtoken');

//Middleware Function, can be added to any route you'd rather keep private.
//Users will only be able to access such routes if their token is verified.

module.exports = function (req, res, next) {
    const token = req.header('auth-token')
    if(!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
}