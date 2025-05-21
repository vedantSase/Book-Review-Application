# Book Review API

A RESTful API for managing book reviews built with Node.js, Express, and MongoDB using MVC architecture.

## Features

- User authentication with JWT
- Book management (add, list, search)
- Nested review system within books
- Pagination and filtering
- Search functionality
- Input validation
- Error handling

## Tech Stack

- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- Express Validator for input validation
- Bcrypt for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- Postman (for API testing)

## Project Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd book-review-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/book-review-api
JWT_SECRET=your-secret-key
NODE_ENV=development
```

4. Start MongoDB:
```bash
# Make sure MongoDB is running on your system
mongod
```

5. Start the server:
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

## Running Locally

1. Ensure MongoDB is running on your system
2. Set up environment variables in `.env` file
3. Install dependencies with `npm install`
4. Start the server with `npm run dev`
5. The API will be available at `http://localhost:3000`

## API Examples

### Using cURL

#### Register a new user
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Add a book (with authentication)
```bash
curl -X POST http://localhost:3000/books \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "Fiction",
    "description": "A story of the fabulously wealthy Jay Gatsby..."
  }'
```

#### Add a review
```bash
curl -X POST http://localhost:3000/books/BOOK_ID/reviews \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "comment": "Great book!"
  }'
```

### Using Postman

1. Import the following collection into Postman:
```json
{
  "info": {
    "name": "Book Review API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "http://localhost:3000/auth/signup",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"john_doe\",\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "http://localhost:3000/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          }
        }
      ]
    }
  ]
}
```

## Design Decisions and Assumptions

### Architecture
- Used MVC pattern for better code organization and maintainability
- Implemented nested reviews within books for better data locality
- Chose JWT for stateless authentication

### Database Design
- Embedded reviews within books to reduce query complexity
- Added indexes for frequently queried fields
- Implemented compound indexes for unique constraints

### Security
- Passwords are hashed using bcrypt
- JWT tokens for stateless authentication
- Input validation using express-validator
- Environment variables for sensitive data

### Performance
- Implemented pagination for list endpoints
- Added text search indexes for efficient searching
- Used lean queries where appropriate

## Database Schema

### User Collection
```javascript
{
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### Book Collection
```javascript
{
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  genre: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

## Project Structure

```
src/
├── app.js              # Application entry point
├── models/            # Database models
│   ├── user.model.js
│   └── book.model.js
├── controllers/       # Route controllers
│   ├── auth.controller.js
│   └── book.controller.js
├── routes/           # API routes
│   ├── auth.routes.js
│   └── book.routes.js
└── middleware/       # Custom middleware
    ├── auth.js
    └── error.middleware.js
```

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## API Response Format

All API responses follow this format:
```javascript
{
  "data": {}, // Response data
  "message": "", // Optional message
  "error": "" // Error message if any
}
```

## Pagination

The API supports pagination for list endpoints:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

## Search

The search endpoint supports:
- Case-insensitive search
- Partial matches
- Search by title and author
- Results sorted by relevance

## License

