let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let storage_processor = require('./modul/storage_processor');
const busboyBodyParser = require('busboy-body-parser');

const folder = require('./modul/folder_storage');

let  index = require('./routes/index');
let  users = require('./routes/folders');

let  app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

storage_processor.start();
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(busboyBodyParser());//for files
app.use('/', index);
app.use('/folders', users);

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
  res.render('error');
});

// app.post('/add', (req, res) => {
    // folder.create('ghg',req.body.name,req.body.size,req.body.type,req.body.location,req.body.owner,req.body.description);
    // console.log(req.json());
    // console.log(req.files);
    // if (req.files.ava) {
    //     let filename = req.files.ava.name;
    //     images[filename] = req.files.ava;
    //     user.avaname = filename;
    // }
    // res.redirect('/folders  ');
// });

// app.post('/add', (req, res) => {
//     folder.getById(1)
//         .then(data => res.render('add', {folder: data}))
//         .catch(err => {
//             console.log("Error: " + err);
//             next();
//     res.render('add', data);
// });



module.exports = app;
