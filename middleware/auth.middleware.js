import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import rateLimit from 'express-rate-limit';

export const protectRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken; 
        if (!accessToken) {
            return res.status(401).json({ message: "Unauthorized - No access token provided" });
        }
        try {
			const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET); // Verify access token
			const user = await User.findById(decoded.userId).select("-password"); // Find user by ID and exclude password field

			if (!user) {
				return res.status(401).json({ message: "User not found" }); 
			}

			req.user = user; // Attach user to request object

			next(); // Call next middleware or route handler i.e adminRouter
		} catch (error) {
			if (error.name === "TokenExpiredError") {
				return res.status(401).json({ message: "Unauthorized - Access token expired" });
			}
			throw error; // will be caught by the outer catch block
		}
    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        res.status(401).json({ message: "Unauthorized - Invalid access token"});
    }
}

export const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5, // Limit each IP to 5 requests per windowMs
	message: 'Too many requests from , please try again after 15 minutes',
});