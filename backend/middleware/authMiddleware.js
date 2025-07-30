// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

/**
 * Authentication middleware:  
 *  - Verifies the presence and format of the Authorization header  
 *  - Verifies the JWT  
 *  - Attaches { id, role } to req.user  
 */
module.exports = (req, res, next) => {
  // 1) Check for header
  const header = req.headers.authorization;
  console.log('📥 Received auth header:', header);
  if (!header) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // 2) Expect “Bearer <token>”
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Malformed authorization header' });
  }

  // 3) Verify JWT
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
