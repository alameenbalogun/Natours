const express = require('express');
const tourController = require('./../controllers/tourControllers');
const authController = require('./../controllers/authController');

const router = express.Router();

// router.param('id', tourController.checkID);
// router
//   .route('/cheap-5-tours')
//   .get(tourController.cheapTours, tourController.getAllTours);
router.route('/:get-tour-stats').get(tourController.getTourStats);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

module.exports = router;
