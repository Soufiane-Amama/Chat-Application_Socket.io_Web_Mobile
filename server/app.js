require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');


//Express Routers.
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// Express Application
const app = express();
const PORT = process.env.PORT || 3001;

// Express Middleware's.
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);



// connect to db
mongoose.connect(process.env.DB_URL)
.then(() => {
  console.log('connected to database')

// listen for requests
app.listen(PORT, () => {
  console.log('listening for requests on port', PORT)
})

})
.catch((err) => {
  console.log(err)
}) 