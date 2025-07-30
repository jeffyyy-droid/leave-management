// backend/middleware/authorize.js
const { can } = require('../services/permissionService');

/**
 * Returns middleware that checks whether the current user
 * (req.user.role) has the given action in its permission list.
 *
 * @param {string} action  One of 'REQUEST_LEAVE', 'VIEW_BALANCE', 'APPROVE_LEAVE'
 */
module.exports = function authorize(action) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!can(req.user.role, action)) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }

    next();
  };
};
