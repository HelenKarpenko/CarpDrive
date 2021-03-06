"use strict";
require('module-alias/register');
let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let bodyParser = require('body-parser');
require('dotenv').config();
const busboyBodyParser = require('busboy-body-parser');

// new imports
const cookieParser = require('cookie-parser');
const cors = require('cors');


// let  index = require('./routes/old/index');
// let  users = require('./routes/old/folders');
// let  res = require('./routes/old/res');
// let  u = require('./routes/old/users');
// let api = require('@API');


const database = require('./storage/controllers/folderController');

database.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds111066.mlab.com:11066/carpdrive`)
// database.connect(process.env.NODE_ENV=='dev'?`mongodb://localhost:27017/carpdrive`:`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds111066.mlab.com:11066/carpdrive`)
    .then(data => {
      console.log('+connected');
      require('./storage/controllers/fileDataController').connect();
    })
    .catch(err => {throw err});

let  app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(busboyBodyParser());//for files


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


require('@auth')(app);
app.use('/api/', require('@API'));

const user = require('./storage/controllers/usersController');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
console.log(res.locals.error);
  // render the error page
  res.status(err.status || 500);
  res.render('error',{
       message:(err.message?err.message:"Erorr"),
          status:err.status
    });
});
module.exports = app;
