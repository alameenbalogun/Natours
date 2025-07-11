const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    changePasswordAt: req.body.changePasswordAt,
    role: req.body.role,
  });

  const token = signToken(newUser._id);
  // try {
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   console.log('Valid token:', decoded);
  // } catch (err) {
  //   console.error('Invalid token:', err.message);
  // }

  res.status(201).json({
    message: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //check for email and password
  if (!email || !password) {
    return next(new AppError('Provide an email and password', 400));
  }

  //confirm if password is correct and users exists
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect password or username', 401));
  }

  const token = signToken(user._id);

  res.status(200).json({
    message: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //gets token and confirm if it is there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // console.log(token);

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to access', 401),
    );
  }

  //verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);

  //if user exits
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError('The token belonging to this user does not exists', 401),
    );
  }

  //if user changes password
  if (freshUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password. Please log in again!', 401),
    );
  }

  req.user = freshUser;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(new AppError('You do not have permission to delete this tour', 403));
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //find user.
  const user = await User.findOne({ email: req.body.email });
  console.log(user);

  if (!user) {
    return next(new AppError('No user found with this email.'));
  }

  //send a token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
});

exports.resetPassword = (req, res, next) => {};
