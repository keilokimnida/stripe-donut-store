// this middleware is for validating a login token

const jwt = require("jsonwebtoken");
const { jwt: { secret: jwtSecret } } = require("../config/config");

module.exports.isLoggedIn = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token", broken: null, expired: null });

        try {
            var decode = jwt.verify(token, jwtSecret);
        }
        catch (error) {
            if (error instanceof jwt.TokenExpiredError) return res.status(401).json({ message: "Token has expired", broken: false, expired: true });
            if (error instanceof jwt.JsonWebTokenError) return res.status(401).json({ message: "Token is broken", broken: true, expired: false });
            throw error;
        }

        // store the auth in the request so that the callback chain can access this data if necessary
        // https://expressjs.com/en/api.html#res.locals
        res.locals.auth = { token, decoded: decode }

        return next();

        // i read/heard somewhere that if after calling next and the chain of callback functions are finished, 
        // and the middleware does not return
        // you can run code under next(), for example setting a last known logon date/time for a user
        // next() is synchronous and blocking
        // i think the order is also backwards in the chain of callback functions
    }
    catch (error) {
        console.log(error);
        return res.status(500).send();
    }
}
