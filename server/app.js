require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors')
// Express Application
const app = express();
app.use(cors())
const PORT = process.env.PORT || 3001;

// Create HTTP server
const server = http.createServer(app);

// Include socket.io handler and pass the server
const io = require('./socket-handler')(server);

// Express Routers.
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

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
app.use('/api/account', require('./routes/account'));

// Errors handling
app.use((err, req, res, next) => {
  if (err.name === 'MongoError' || err.name === 'ValidationError' || err.name === 'CastError') {
    err.status = 422;
  }
  if (req.get('accept').includes('json')) {
    res.status(err.status || 500).json({ message: err.message || 'some error occurred.' });
  } else {
    res.status(err.status || 500).sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

// connect to db
mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log('connected to database');

    // listen for requests
    server.listen(PORT, () => {
      console.log('listening for requests on port', PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });