const Book = require('../models/book.model');
const { validationResult } = require('express-validator');

// Add a new book
exports.createBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error creating book', error: error.message });
  }
};

// Get all books with pagination and filters
exports.getAllBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.author) query.author = new RegExp(req.query.author, 'i');
    if (req.query.genre) query.genre = new RegExp(req.query.genre, 'i');

    const books = await Book.find(query)
      .populate('reviews.user', 'username')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Book.countDocuments(query);

    res.json({
      books,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBooks: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
};

// Get book by ID with reviews
exports.getBookById = async (req, res) => {
  try {
    if(!req.params.id){
      return res.status(400).json({ message: 'Book ID is required' });
    }
    const book = await Book.findById(req.params.id)
      .populate('reviews.user', 'username');
      
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book', error: error.message });
  }
};

// Search books
exports.searchBooks = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const books = await Book.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
    .populate('reviews.user', 'username')
    .sort({ score: { $meta: 'textScore' } })
    .limit(10);

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error searching books', error: error.message });
  }
};

// Add a review to a book
exports.addReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if(!req.params.id){
      return res.status(400).json({ message: 'Book ID is required' });
    }
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user already reviewed this book
    const existingReview = book.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }

    book.reviews.push({
      user: req.user._id,
      rating: req.body.rating,
      comment: req.body.comment
    });

    await book.save();
    await book.populate('reviews.user', 'username');
    
    res.status(201).json({message: 'Review added successfully', book});
  } catch (error) {
    res.status(500).json({ message: 'Error adding review', error: error.message });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id: bookId } = req.params;
    if (!bookId) {
      return res.status(400).json({ message: 'Book ID is required' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Find existing review by authenticated user
    const existingReview = book.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      // Update existing review
      existingReview.rating = req.body.rating;
      existingReview.comment = req.body.comment;
    } else {
      // Add new review if user hasn't reviewed this book
      book.reviews.push({
        user: req.user._id,
        rating: req.body.rating,
        comment: req.body.comment
      });
    }
    
    await book.save();
    await book.populate('reviews.user', 'username');
    
    res.status(200).json({
      message: existingReview ? 'Review updated successfully' : 'Review added successfully',
      book
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating review', error: error.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    if(!req.params.id){
      return res.status(404).json({ message: 'BookId not found' });
    }
    const book = await Book.findById(req.params.id);  
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const review = book.reviews.id(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    review.remove();
    await book.save();
    await book.populate('reviews.user', 'username');
    
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
};
