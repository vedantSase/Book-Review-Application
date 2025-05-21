const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');

// Validation middleware
const validateSignup = [
  body('username').trim().isLength({ min: 3 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
];

// Routes
router.post('/signup', validateSignup, authController.signup);
router.post('/login', validateLogin, authController.login);

module.exports = router;