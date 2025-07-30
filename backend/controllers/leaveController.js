// backend/controllers/leaveController.js
const Leave = require('../models/leaveModel');
const User  = require('../models/User');

exports.applyLeave = async (req, res) => {
  try {
    const { leave_type, start_date, end_date } = req.body;
    if (!leave_type || !start_date || !end_date) {
      return res.status(400).json({ message: 'leave_type, start_date, and end_date are required' });
    }

    const leave = new Leave({
      leave_type,
      start_date,
      end_date,
      user: req.user.id      // set by authMiddleware
    });
    await leave.save();

    res.status(201).json(leave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getLeaves = async (req, res) => {
  try {
    let leaves;
    if (req.user.role === 'admin') {
      // Admin sees everyone’s requests
      leaves = await Leave.find()
        .populate({ path: 'user', select: ['Full Name', 'Email', 'role'] });
    } else {
      // Interns & employees see only their own
      leaves = await Leave.find({ user: req.user.id });
    }
    res.json(leaves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateLeave = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    leave.status = status;
    await leave.save();
    res.json(leave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
