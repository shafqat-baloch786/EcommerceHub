


const authorizeRole = (...roles) => {
    return async(req, res, next) => {
        try {

            // Check if there is no user attached with request
            if(!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "User not auhenticated!"
                });
            }

            // If there are no roles added from router
            if(!roles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied!"
                })
            }

            next();
        } catch(error) {
            console.log("Error in auhorize role check!", error)
        }
    }
}

module.exports = authorizeRole;