const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model.js');

// user authentication middleware
async function protect(req, res, next) {
    const token = req.headers.authorization && 
    req.headers.authorization.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : null;
    
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = user;

        next();

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// admin authentication middleware
function adminProtect(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            message: 'Forbidden'
        });
    }

    next();
}


module.exports = {
    protect,
    adminProtect
};