const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      minLength: [10, 'A tour must be more than or equal 10'],
      maxLength: [40, 'A tour must be less than or equal 40'],
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficulty'],
        message: 'Difficulty is either: easy, medium, or difficulty',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'A tour must have a rating more than or equal 1'],
      max: [5, 'A tour must have a rating less than or equal 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Price discount must be less than the regular price',
      },
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    startDates: [Date],
    slug: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

//creating virtual properties
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//document middleware, pre and post
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//query middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

//aggregation middleware
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } },
  });
  // console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
