const Tour = require('./../models/tourModel');
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

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    // Clone req.query
    const queryObj = { ...req.query };
    const excludedFields = ['sort', 'page', 'limit'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering (e.g., price[gt]=2000 → { price: { $gt: 2000 } })
    let mongoQuery = {};
    Object.keys(queryObj).forEach((key) => {
      if (key.includes('[')) {
        const [field, operator] = key.split('[');
        const op = operator.replace(']', '');
        if (!mongoQuery[field]) mongoQuery[field] = {};
        mongoQuery[field][`$${op}`] = queryObj[key];
      } else {
        mongoQuery[key] = queryObj[key];
      }
    });

    // Convert numeric values from strings to numbers
    Object.keys(mongoQuery).forEach((key) => {
      if (typeof mongoQuery[key] === 'object') {
        Object.keys(mongoQuery[key]).forEach((opKey) => {
          const val = mongoQuery[key][opKey];
          mongoQuery[key][opKey] = isNaN(val) ? val : Number(val);
        });
      } else {
        mongoQuery[key] = isNaN(mongoQuery[key])
          ? mongoQuery[key]
          : Number(mongoQuery[key]);
      }
    });

    // Execute the query
    const query = Tour.find(mongoQuery);

    const tours = await query;

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
