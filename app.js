const fs = require('fs');
const express = require('express');
const morgan = require("morgan")

const app = express();

app.use(morgan("dev"))
app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware🫡');

  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);

//routes
// app.get('/', (req, res) => {
//   //   res.status(200).send('Hello from the server side');
//   res.status(200).json({ message: 'Hello from the server', app: 'Natours!' });
// });

// app.post('/', (req, res) => {
//   res.send('You can now post to this endpoint.');
// });

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    result: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour > tours.length) {
    res.status(404).json({
      status: 'fail',
      data: {
        message: 'Invalid ID',
      },
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tours: newTour,
        },
      });
    }
  );

  //   console.log(newTour);
  //   console.log(req.body);
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    res.status(404).json({
      status: 'fail',
      data: {
        message: 'Invalid ID',
      },
    });
  }
  res.status(200).json({
    status: 'sucess',
    data: {
      message: 'File successfully updated',
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    res.status(404).json({
      status: 'fail',
      data: {
        message: 'Invalid ID',
      },
    });
  }
  res.status(204).json({
    status: 'sucess',
    data: null,
  });
};

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
app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

//PORT
const port = 8000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
