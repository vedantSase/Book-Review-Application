const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const bookController = require('../controllers/book.controller');
const auth = require('../middleware/auth');

// Validation middleware
const validateBook = [
  body('title').trim().notEmpty(),
  body('author').trim().notEmpty(),
  body('genre').trim().notEmpty(),
  body('description').trim().notEmpty()
];

const validateReview = [
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').trim().notEmpty()
];

// Book routes
router.post('/', auth, validateBook, bookController.createBook);
router.get('/', bookController.getAllBooks);
router.get('/search', bookController.searchBooks);
router.get('/:id', bookController.getBookById);

// Review routes
router.post('/:id/reviews', auth, validateReview, bookController.addReview);
router.put('/reviews/bookId', auth, validateReview, bookController.updateReview);
router.delete('/:id', auth, bookController.deleteReview);

module.exports = router; 