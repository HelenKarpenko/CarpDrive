"use strict";
let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let bodyParser = require('body-parser');
require('dotenv').config();
const busboyBodyParser = require('busboy-body-parser');

// new imports
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const crypto = require('crypto');

let  index = require('./routes/index');
let  users = require('./routes/folders');
let  res = require('./routes/res');
let  u = require('./routes/users');
const user = require('./controllers/usersController');



const database = require('./controllers/folderController');
database.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds111066.mlab.com:11066/carpdrive`)
// database.connect(`mongodb://localhost:27017/carpdrive`)
    .then(data => {
      console.log('+connected');
      require('./controllers/fileDataController').connect();
    })
    .catch(err => {throw err});

let  app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(busboyBodyParser());//for files


/////
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret: 'SEGReT$25_',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/folders', users);
app.use('/res', res);
app.use('/users', u);

const serverSalt = "45%sAlT_";

function sha512(password, salt) {
    const hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    const value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
};

passport.use(new LocalStrategy(
    function (username, password, done) {
        let hash = sha512(password, serverSalt).passwordHash;
        // console.log(username, password);
        user.getByLogin(username)
            .then(data => {
                console.log(hash, data[0].password)
                if(data && hash===data[0].password) {
                    done(null, data[0]);
                }else{
                    done('Passport error 1');
                }
            }).catch(e=>done(e));
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    user.getById(id)
        .then(data => {
            done(data ? null : 'No user',data)
        });
});

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
//
// res.status(err.status || 500);
// res.render('error',{
//     message: err.message,
//     status: err.status,
// });

module.exports = app;
