const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const gloablErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const app = express();
console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

//to display static files
// app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware🫡');

  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

//routes
// app.get('/', (req, res) => {
//   //   res.status(200).send('Hello from the server side');
//   res.status(200).json({ message: 'Hello from the server', app: 'Natours!' });
// });

// app.post('/', (req, res) => {
//   res.send('You can now post to this endpoint.');
// });

{
  /**
  app.get('/api/v1/tours', getAllTours);
  app.get('/api/v1/tours/:id', getTour);
  app.post('/api/v1/tours', createTour);
  app.patch('/api/v1/tours/:id', updateTour);
  app.delete('/api/v1/tours/:id', deleteTour);
  */
}

//A better way for routing is:

//users routes

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('/{*any}', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.statusCode = 404;
  // err.status = 'fail';

  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(gloablErrorHandler);

// app.all('*', (req, res, next) => {
//   // Create error object
//   const err = new Error(`Can't find ${req.originalUrl} on this server!`);
//   err.status = 'fail';
//   err.statusCode = 404;

//   // Pass to error handling middleware
//   next(err);
// });

//PORT

module.exports = app;
