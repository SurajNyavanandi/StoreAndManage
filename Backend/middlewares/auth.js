import jwt from 'jsonwebtoken';

export const authenticateToken = async (req, res, next) => {
    try {
        // Step 1: Extract token from Authorization header
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];
        
        // Step 2: Check if token exists
        if (!token) {
            return res.status(401).json({ message: "Token is required" });
        }
        
        // Step 3: Verify token using secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Step 4: Store user data in req.user for next middleware/route
        req.user = decoded;
        
        // Step 5: Allow request to proceed
        next();
        
    } catch (error) {
        // Step 6: Handle token errors
        console.log("Error: " + error.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};