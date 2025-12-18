// middleware/auth.js

module.exports = {
  isAuthenticated: (req, res, next) => {
    // ✅ Passport handles authentication
    if (req.isAuthenticated && req.isAuthenticated()) {
      return next();
    }

    // ✅ API requests → JSON
    if (req.xhr || req.headers.accept?.includes("json")) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated"
      });
    }

    // ✅ UI requests → redirect to homepage (login page)
    return res.redirect("/");
  }
};
