const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  err = `Invalid ${err.path}: ${err.value}`;
  return new AppError(err, 400);
};

const handleDuplicateErrorDB = (err) => {
  const duplicateValue = err.keyValue
    ? Object.values(err.keyValue)[0]
    : '[unknown]';
  console.log(duplicateValue);
  const message = `Duplicate field value: ${duplicateValue}. Please use another value!`;
  return new AppError(message, 400);
};

const handleJWTError = (err) =>
  new AppError('Invalid token!! Please log in again.', 401);

const handleJWTExpireError = (err) =>
  new AppError('Token expired. Please log in again', 401);

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

// module.exports = (err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';

//   if (process.env.NODE_ENV === 'development') {
//     sendErrorDev(err, res);
//   } else if (process.env.NODE_ENV === 'production') {
//     let error = { ...err, name: err.name, message: err.message };
//     console.log(error);

//     if (error.name === 'CastError') {
//       error = handleCastErrorDB(error);
//     }
//     sendErrorProd(err, res);
//   }
// };

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // Important: Need to copy the name property explicitly
    let error = { ...err, name: err.name, message: err.message };
    console.error(error);

    // Handle specific MongoDB errors
    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }

    if (error.code === 11000) {
      error = handleDuplicateErrorDB(error);
    }

    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);

    if (error.name === 'TokenExpiredError') error = handleJWTExpireError(error);

    sendErrorProd(error, res);
  }
};
