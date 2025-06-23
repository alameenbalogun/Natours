const fs = require('fs');
const express = require('express');

const app = express();
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

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
});

//PORT
const port = 8000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
