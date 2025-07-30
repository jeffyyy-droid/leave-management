const express    = require('express');
const { applyLeave, getLeaves, updateLeave } = require('../controllers/leaveController');
const authorize    = require('../middleware/authorize');

const router = express.Router();

// Only users with REQUEST_LEAVE can create new leave requests
router.post(
  '/',
  authorize('REQUEST_LEAVE'),
  applyLeave
);

// Only users with VIEW_BALANCE can view leave requests
router.get(
  '/',
  authorize('VIEW_BALANCE'),
  getLeaves
);

// Only users with APPROVE_LEAVE can approve/deny
router.patch(
  '/:id',
  authorize('APPROVE_LEAVE'),
  updateLeave
);

module.exports = router;
