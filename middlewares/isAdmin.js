// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    const { role } = req.user; // Assuming user info is stored in req.user

    if (role !== 'Admin') {
        return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    next(); // Proceed if user is admin
};

module.exports = isAdmin;
