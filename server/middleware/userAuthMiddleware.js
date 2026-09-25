const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protectUser = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Please login to continue.' });
    }

    const token = auth.split(' ')[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'community_health_camp_super_secret_jwt_key_2026'
    );

    if (decoded.role !== 'user') {
      return res.status(401).json({ message: 'Invalid user token.' });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User account no longer exists.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token.' });
  }
};

module.exports = { protectUser };
