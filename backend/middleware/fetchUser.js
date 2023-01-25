const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Thanks Harry for this lovely project!';

const fetchUser = (req, res, next)=>{
    // Get the user with the help of jwt token and add id to req object
    success = false;
    const token = req.header('auth-token');
    if(!token){
        return res.status(401).json({success, errors:"Missing auth token"})
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user
        next();
    } catch (error) {
        return res.status(401).json({success, errors:"Invalid auth token"})
    }
}

module.exports = fetchUser;