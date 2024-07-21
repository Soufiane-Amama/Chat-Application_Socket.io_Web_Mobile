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
app.use(express.static(path.join(__dirname, 'public')));


// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/auth', require('./routes/auth'));


// Errors handling
app.use((err, req, res, next) => {
  if(err.name === 'MongoError' || err.name === 'ValidationError' || err.name === 'CastError'){
      err.status = 422;
  }
  if(req.get('accept').includes('json')){
      res.status(err.status || 500).json({message: err.message || 'some error eccured.'});
  } else {
      res.status(err.status || 500).sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});


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