const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
// console.log(DB);

//connecting database
mongoose.connect(DB).then((con) => {
  // console.log(con.connection);
  console.log('Database connected successfully');
});

const port = 8000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
