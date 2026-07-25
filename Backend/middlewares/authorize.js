export const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        try {
            // Step 1: Get user from middleware
            const user = req.user;
            
            // Step 2: Check if user exists
            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }
            
            // Step 3: Check if user role is in allowed roles
            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({
                    message: `Access denied! Only ${allowedRoles.join(', ')} can access`
                });
            }
            
            // Step 4: Role is allowed, proceed
            next();
            
        } catch (error) {
            // Step 5: Handle errors
            console.log("Error: " + error.message);
            return res.status(500).json({ message: "Authorization error" });
        }
    };
};