const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    message: 'success',
    data: {
      users,
    },
  });
});
exports.createUser = (req, res) => {
  res.status(500).json({
    message: 'error',
    data: 'Route has not been developed',
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    message: 'error',
    data: 'Route has not been developed',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    message: 'error',
    data: 'Route has not been developed',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    message: 'error',
    data: 'Route has not been developed',
  });
};
