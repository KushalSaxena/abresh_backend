// Middleware to check for admin role
exports.isAdmin = (req, res, next) => {
    try {
      const authHeader = req.header('Authorization');
  
      // Check if Authorization header is present
      if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
      }
  
      const token = authHeader.replace('Bearer ', '');
  
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Check if the user role is Admin
      if (decoded.role !== 'Admin') {
        return res.status(403).json({ error: 'Access denied. Admins only' });
      }
  
      next();  // Proceed to the next middleware or route handler
    } catch (err) {
      // Handle any errors (e.g., token invalid, token expired, etc.)
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
  