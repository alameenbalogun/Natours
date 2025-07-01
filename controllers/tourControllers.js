const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
// const fs = require('fs');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
// );
// console.log(tours)

// exports.checkID = (req, res, next) => {
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       data: {
//         message: 'Invalid ID',
//       },
//     });
//   }

//   next();
// };

// exports.checkBody = (req, res, next) => {
//   const { name, difficulty, duration } = req.body;
//   if ((name, difficulty, duration === '')) {
//     return res.status(400).json({
//       status: 'bad request',
//       message: 'Body must contain name, price and duration',
//     });
//   }

//   next();
// };

// exports.getAllTours = async (req, res) => {
//   try {
//     console.log(req.query);

//     //ways to implement query
//     const queryObj = { ...req.query };
//     console.log(queryObj);
//     const excludedFields = ['sort', 'page', 'limit'];
//     excludedFields.forEach((el) => delete queryObj[el]);
//     // console.log(queryObj);

//     let queryStr = JSON.stringify(queryObj);
//     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//     console.log(JSON.parse(queryStr));

//     //1.
//     // const tours = await Tour.find({
//     //   difficulty: 'easy',
//     //   duration: 5,
//     // });

//     const query = Tour.find(JSON.parse(queryStr));

//     const tours = await query;

//     //2.
//     // const tours = await Tour.find()
//     //   .where('difficulty')
//     //   .equals('easy')
//     //   .where('duration')
//     //   .equals(5);

//     // const tours = await Tour.find();
//     res.status(200).json({
//       status: 'success',
//       requestedAt: req.requestTime,
//       result: tours.length,
//       data: {
//         tours,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };

// exports.cheapTours = (req, res, next) => {
//   console.log('🧠 Before setting:', req.query);

//   // Replace the entire req.query object with a clean prototype
//   ((req.query.sort = 'price,-ratingsAverage'),
//     (req.query.limit = '5'),
//     (req.query.fields = 'name,price,ratingsAverage'),
//     console.log('✅ After setting req.query:', req.query));

//   next();
// };

exports.getAllTours = async (req, res) => {
  try {
    // console.log(req);

    // Clone this.queryStr
    // const queryObj = { ...req.query };
    // const excludedFields = ['sort', 'page', 'limit', 'fields'];
    // excludedFields.forEach((el) => delete queryObj[el]);

    // // Advanced filtering (e.g., price[gt]=2000 → { price: { $gt: 2000 } })
    // let mongoQuery = {};
    // Object.keys(queryObj).forEach((key) => {
    //   if (key.includes('[')) {
    //     const [field, operator] = key.split('[');
    //     const op = operator.replace(']', '');
    //     if (!mongoQuery[field]) mongoQuery[field] = {};
    //     mongoQuery[field][`$${op}`] = queryObj[key];
    //   } else {
    //     mongoQuery[key] = queryObj[key];
    //   }
    // });

    // // Convert numeric values from strings to numbers
    // Object.keys(mongoQuery).forEach((key) => {
    //   if (typeof mongoQuery[key] === 'object') {
    //     Object.keys(mongoQuery[key]).forEach((opKey) => {
    //       const val = mongoQuery[key][opKey];
    //       mongoQuery[key][opKey] = isNaN(val) ? val : Number(val);
    //     });
    //   } else {
    //     mongoQuery[key] = isNaN(mongoQuery[key])
    //       ? mongoQuery[key]
    //       : Number(mongoQuery[key]);
    //   }
    // });

    // Execute the query
    // let query = Tour.find(mongoQuery);

    //sorting
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   console.log(sortBy);
    //   query = query.sort(sortBy);
    // }

    //limiting fields
    // if (req.query.fields) {
    //   console.log(req.query.fields);
    //   const fields = req.query.fields.split(',').join(' ');
    //   console.log(fields);
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }

    //pagination
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 10;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();

    //   if (skip >= numTours) throw new Error('This page does not exits');
    // }

    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .paginate()
      .limitFields();
    const tours = await features.query;

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const id = req.params.id;
    // const tour = tours.find((el) => el.id === id);

    const tour = await Tour.findById(id);

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  // const newId = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);

  // tours.push(newTour);

  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   (err) => {
  //     res.status(201).json({
  //       status: 'success',
  //       data: {
  //         tours: newTour,
  //       },
  //     });
  //   }

  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tours: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }

  //   console.log(newTour);
  //   console.log(req.body);
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'sucess',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'sucess',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
