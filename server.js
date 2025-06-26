const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
// console.log(DB);
mongoose.connect(DB).then((con) => {
  // console.log(con.connection);
  console.log('Database connected successfully');
});

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

const tourTest = new Tour({
  name: 'The park Camper',
  price: 200,
});

tourTest
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log('Error', err);
  });

const port = 8000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
