const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env; // JWT secret from environment variables 

// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.query.token || req.body.token; // Get the token from the Authorization header, query string, or request body

    if (!token) return res.status(401).json({ error: 'Token mancante' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Verify the token using the secret
        req.user = decoded; // Attach the decoded user information to the request object
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token non valido' });
    }
};