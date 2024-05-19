import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';
const authenticate = async (req, res, next) => {
    const { token } = req.body;

    if(!token || isExpired(token)) {
        res.status(400).json({error: 'Please Login again'});
        return;
    }
    
    const user_id = jwt.verify(token, process.env.JWT_SECRET).userId;
    
    try {
        const user = await User.findOne({_id: user_id});
        if(user) {
            next();
        } else {
            res.status(400).json({error: "Login failed"});
        }
    } catch(error) {
        console.log("Error in authentication controller", error.message);
        res.status(500).json({error:"Internal Server Error"});
    };
};

const isExpired = (token) => {
    //check if expired
    const decoded = jwt.decode(token, { complete: true });

    if (!decoded || !decoded.payload || !decoded.payload.exp) {
        return true; // Token is invalid or doesn't have an expiration time
    }
    const currentTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds
    
    return decoded.payload.exp < currentTimestamp; // Check if token is expired
}

export default authenticate;