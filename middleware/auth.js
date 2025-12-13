const User = require('../models/User');

// Authentication middleware
module.exports = {
  isAuthenticated: async (req, res, next) => {
    try {
      // Check if user is authenticated
      if (req.session && req.session.user) {
        // Attach user to request object
        const user = await User.findById(req.session.user._id);
        if (!user) {
          throw new Error('User not found');
        }
        req.user = user;
        return next();
      }
      
      // If not authenticated and it's an API request, return JSON
      if (req.xhr || req.headers.accept?.includes('json')) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }
      
      // Otherwise, redirect to login
      return res.redirect('/auth/login');
    } catch (error) {
      console.error('Authentication error:', error);
      if (req.xhr || req.headers.accept?.includes('json')) {
        return res.status(500).json({ success: false, message: 'Authentication error' });
      }
      return res.redirect('/auth/login');
    }
  }
};
