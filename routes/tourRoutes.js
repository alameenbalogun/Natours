const express = require('express');
const tourController = require('./../controllers/tourControllers');

const router = express.Router();

// router.param('id', tourController.checkID);
// router
//   .route('/cheap-5-tours')
//   .get(tourController.cheapTours, tourController.getAllTours);
router.route('/get-tour-stats').get(tourController.getTourStats);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
