import jwt from "jsonwebtoken";
import User from './../models/user.js';

const AuthMiddleWare = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        if(!token) {
            return res.status(401).json({message: "Unauthorized"})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if(!User){
            return res.status(401).json({message: "Unauthorized"});
        }
        req.user = user;
        next();
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server error"});

    }
}

export default AuthMiddleWare;