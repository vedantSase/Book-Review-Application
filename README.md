# Book Review API
  <!-- Documentation is made using AI tools  -->
A RESTful API for managing book reviews built with Node.js, Express, and MongoDB using MVC architecture.

## Features

- User authentication with JWT
- Book management (add, list, search)
- Review system (add, update, delete)
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

## Setup

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

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

#### Register a new user
```http
POST /api/auth/signup
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Books

#### Add a new book (Authenticated)
```http
POST /api/books
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "genre": "Fiction",
  "description": "A story of the fabulously wealthy Jay Gatsby..."
}
```

#### Get all books
```http
GET /api/books?page=1&limit=10&author=Fitzgerald&genre=Fiction
```

#### Get book by ID
```http
GET /api/books/:id
```

#### Search books
```http
GET /api/books/search?query=gatsby
```

### Reviews

#### Add a review (Authenticated)
```http
POST /api/books/:id/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Great book!"
}
```

#### Update a review (Authenticated)
```http
PUT /api/books/:id/reviews/:reviewId
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 4,
  "comment": "Updated review"
}
```

#### Delete a review (Authenticated)
```http
DELETE /api/books/:id/reviews/:reviewId
Authorization: Bearer <token>
```

## Database Schema

### User
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Book
```javascript
{
  title: String,
  author: String,
  genre: String,
  description: String,
  reviews: [{
    user: ObjectId (ref: User),
    rating: Number,
    comment: String,
    createdAt: Date,
    updatedAt: Date
  }],
  averageRating: Number,
  totalReviews: Number,
  createdAt: Date,
  updatedAt: Date
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

## Security Features

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Input validation using express-validator
- Environment variables for sensitive data
- CORS enabled
- Request rate limiting (optional)

## Development

To run tests:
```bash
npm test
```

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

MIT 