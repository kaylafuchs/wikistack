var express = require('express');
var sequelize = require('sequelize');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var wikiRouter = require('./routes/wiki');
var usersRouter = require('./routes/users');
var swig = require('swig');
var path = require('path');
var models = require('./models');
var app = express();

// point res.render to the proper directory
app.set('views', __dirname + '/views');
// have res.render work with html files
app.set('view engine', 'html');
// when res.render works with html files
// have it use swig to do so
app.engine('html', swig.renderFile);
// turn of swig's caching
swig.setDefaults({cache: false});

app.use(express.static(path.join(__dirname, '/public')));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan());
app.use('/wiki', wikiRouter);
app.use('/users', usersRouter);

models.User.sync()
.then(function () {
    return models.Page.sync()
})
.then(function () {
    app.listen(3001, function () {
        console.log('Server is listening on port 3001!');
    });
})
.catch(console.error);