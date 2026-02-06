const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const asyncWrapper = require('./utils/asyncWrapper');
const errorMiddleware = require('./middlewares/errorHandler');
const authRoute = require('./routes/authRoute');
const categoryRoute = require('./routes/categoryRoute');
const productRoute = require('./routes/productRoute');


// HTTP headers for security
app.use(helmet());

// Allow for origins
app.use(cors());

// Body parsers
app.use(express.json()); // parse JSON
app.use(express.urlencoded({ extended: true })); // parse form data

// Routes
app.use('/api/auth', authRoute);

// Category route
app.use('/api', categoryRoute);

// Product route
app.use('/api', productRoute);

// error middleware
app.use(errorMiddleware);

// Exporitng express app
module.exports = app;