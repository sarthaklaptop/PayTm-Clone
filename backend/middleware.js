const {JWT_SECRET} = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    // console.log("Inside Middleware");
    const authorization = req.headers.authorization;

    if(!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(403).json({
            "Error" : "No Authorization Error"
        });
    }

    const token = authorization.split(' ')[1];

    // console.log(`"Token: " ${token}`)

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // console.log("decoded")

        if(decoded.userId) {
            req.userId = decoded.userId;
            next();
        } else {
            console.log("Invalid token");
            return res.status(403).json({
                "Error": "Invalid token"
            });
        }

    } catch(err) {
        console.log("Token verification failed");
        return res.status(403).json({
            "Error": "Token verification failed",
            "Message": err.message
        });
    }
};

module.exports = {
    authMiddleware
}